import { Injectable } from '@angular/core';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { FailureNotification, InfoNotification, SuccessNotification } from '@notification';
import { NotificationService, RecipeIngredientModalService } from '@modalService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredientService } from '@userIngredientService';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { Recipe, Recipes } from '@recipe';
import { UserIngredient, UserIngredients } from '@userIngredient';
import { Ingredient, Ingredients } from '@ingredient';
import { NumberService } from '@numberService';
import { RecipeIngredient, RecipeIngredients } from '@recipeIngredient';
import { MealPlannerComponent } from 'src/app/shopping/meal-planner/meal-planner.component';

@Injectable({
  providedIn: 'root',
})
export class RecipeIngredientService {
  constructor(
    private recipeIngredientModalService: RecipeIngredientModalService,
    private uomService: UomService,
    private notificationService: NotificationService,
    private recipeHistoryService: RecipeHistoryService,
    private userIngredientService: UserIngredientService,
    private numberService: NumberService
  ) {}

  buildRecipeIngredients(
    recipeIngredients: RecipeIngredients,
    allIngredients: (Ingredient | Recipe)[]
  ): RecipeIngredients {
    return recipeIngredients.reduce((result, recipeIngredient) => {
      const ingredient = allIngredients.find(({ id }) => id === recipeIngredient.id);
      if (ingredient) {
        result.push(
          new RecipeIngredient({
            ...recipeIngredient,
            name: ingredient.name,
            volumeUnit: ingredient.uom,
            weightUnit: 'altUOM' in ingredient ? ingredient.altUOM : null,
          })
        );
      }
      return result;
    }, [] as RecipeIngredients);
  }

  /**
   * Iterative version of finding recipe ingredients.
   * Flattens recipe ingredients hierarchy into a single list with parent ids.
   * @param recipe recipe to find ingredients for
   * @param recipes all recipes
   * @returns ingredients
   */
  findRecipeIngredients(recipe: Recipe, recipes: Recipes): RecipeIngredients {
    const addedIngredients: RecipeIngredients = [];

    // sort required ingredients before optional ingredients
    let startingIngredients: RecipeIngredients = [...recipe.ingredients].sort(
      ({ isOptional: a }, { isOptional: b }) => Number(b) - Number(a)
    );
    while (startingIngredients.length) {
      const recipeIngredient = startingIngredients.pop();

      const ingredientRecipe = recipes.find(({ id }) => id === recipeIngredient.id);
      const alreadyEvaluated = recipeIngredient.paths.includes(ingredientRecipe?.id);
      if (alreadyEvaluated) {
        continue;
      }

      addedIngredients.push(recipeIngredient);
      if (!ingredientRecipe) {
        continue;
      }

      const recipeIngredients = ingredientRecipe.ingredients.map(current => {
        // recipe ingredient should allow optional
        return new RecipeIngredient({
          ...current,
          isOptional: current.isOptional || recipeIngredient.isOptional,
          parent: ingredientRecipe.id,
          paths: recipeIngredient.paths.concat(ingredientRecipe.id),
        });
      });
      startingIngredients = startingIngredients.concat(recipeIngredients);
    }

    return addedIngredients;
  }

  /**
   * Iterative version of finding ingredient recipe ids and includes itself
   * @param recipe recipe to find ingredients for
   * @param recipes all recipes
   * @returns recipe ids
   */
  findRecipeIds(recipe: Recipe, recipes: Recipes): string[] {
    const addedRecipes: RecipeIngredients = [];

    let startingIngredients = [...recipe.ingredients];
    while (startingIngredients.length) {
      const ingredient = startingIngredients.pop();

      const isAdded = addedRecipes.find(({ id }) => id === ingredient.id);
      if (!isAdded) {
        addedRecipes.push(ingredient);

        const ingredientRecipe = recipes.find(({ id }) => id === ingredient.id);
        if (ingredientRecipe) {
          startingIngredients = startingIngredients.concat(ingredientRecipe.ingredients);
        }
      }
    }

    return addedRecipes
      .filter(({ uom }) => uom === UOM.RECIPE)
      .map(({ id }) => id)
      .concat(recipe.id);
  }

  getRecipeCalories(recipe: Recipe, recipes: Recipes, ingredients: Ingredients): number {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    const servings = Number(recipe.servings);
    if (!servings) {
      return 0;
    }

    return (
      recipeIngredients
        .filter(({ isOptional, uom }) => !isOptional && uom !== UOM.RECIPE)
        .reduce((calories, recipeIngredient) => {
          const ingredient = ingredients.find(({ id }) => id === recipeIngredient.id);
          const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
          const convertedQuantity = this.uomService.convert(
            recipeIngredient.uom,
            ingredient.uom,
            quantity
          );

          if (!convertedQuantity || !ingredient.calories) {
            return calories;
          }

          return (
            calories +
            (Number(ingredient.calories) / Number(ingredient.amount)) * Number(convertedQuantity)
          );
        }, 0) / servings
    );
  }

  addIngredients(
    recipe: Recipe,
    recipes: Recipes,
    ingredients: Ingredients,
    userIngredients: UserIngredients,
    uid: string,
    householdId: string,
    callback?: MealPlannerComponent['addAllIngredients']
  ): void {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    if (recipeIngredients.length > 0) {
      this.recipeIngredientModalService.setModal(
        new RecipeIngredientModal(
          this.addIngredientsEvent,
          recipe,
          recipes,
          recipeIngredients,
          ingredients,
          userIngredients,
          uid,
          householdId,
          callback
        )
      );
    } else {
      this.notificationService.setModal(new InfoNotification('Recipe has no ingredients'));
      callback?.();
    }
  }

  addIngredientsEvent = (
    recipeIngredients: RecipeIngredients,
    userIngredients: UserIngredients,
    ingredients: Ingredients,
    uid: string,
    householdId: string,
    recipe?: Recipe,
    recipes?: Recipes
  ): void => {
    recipeIngredients
      .filter(({ uom }) => uom !== UOM.RECIPE)
      .reduce((list, recipeIngredient) => {
        const ingredient = ingredients.find(({ id }) => id === recipeIngredient.id);
        if (!ingredient) {
          return list;
        }

        const quantity = this.numberService.toDecimal(recipeIngredient.quantity);

        let cartQuantity;
        let convertedValue = this.uomService.convert(
          recipeIngredient.uom,
          ingredient.uom,
          quantity
        );
        if (convertedValue) {
          cartQuantity = convertedValue / Number(ingredient.amount);
        } else {
          convertedValue = this.uomService.convert(
            recipeIngredient.uom,
            ingredient.altUOM,
            quantity
          );
          if (convertedValue) {
            cartQuantity = convertedValue / Number(ingredient.altAmount);
          }
        }
        if (!convertedValue) {
          this.notificationService.setModal(new FailureNotification('Calculation error!'));
          return list;
        }

        const isConverted = list.find(({ id }) => id === recipeIngredient.id);
        if (isConverted) {
          isConverted.cartQuantity += cartQuantity;
        } else {
          recipeIngredient.cartQuantity = cartQuantity;
          list.push(recipeIngredient);
        }

        return list;
      }, [])
      .forEach(recipeIngredient => {
        const ingredient = ingredients.find(({ id }) => id === recipeIngredient.id);

        const userIngredient = userIngredients.find(
          ({ ingredientId }) => ingredientId === recipeIngredient.id
        );

        const quantity =
          ingredient.buyableUOM === 'volume'
            ? Math.ceil(recipeIngredient.cartQuantity) * Number(ingredient.amount)
            : Math.ceil(recipeIngredient.cartQuantity) * Number(ingredient.altAmount);

        if (userIngredient) {
          userIngredient.cartQuantity += quantity;
        } else {
          userIngredients.push(
            new UserIngredient({
              uid: householdId,
              ingredientId: String(recipeIngredient.id),
              cartQuantity: quantity,
            })
          );
        }
      });
    this.userIngredientService.update(userIngredients);

    if (recipe && recipes) {
      const cookedRecipeIds = this.findRecipeIds(recipe, recipes);
      cookedRecipeIds.forEach(recipeId => {
        this.recipeHistoryService.add(uid, recipeId);
        if (householdId !== uid) {
          this.recipeHistoryService.add(householdId, recipeId);
        }
      });
    }

    this.notificationService.setModal(new SuccessNotification('Added to list!'));
  };
}
