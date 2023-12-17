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
          })
        );
      }
      return result;
    }, []);
  }

  /**
   * Iterative version of finding recipe ingredients
   * Doesn't combine duplicate ingredient quantities (buyable amounts should handle quantities)
   * @param recipe recipe to find ingredients for
   * @param recipes all recipes
   * @returns ingredients
   */
  findRecipeIngredients(recipe: Recipe, recipes: Recipes): RecipeIngredients {
    const addedIngredients: RecipeIngredients = [];

    // sort required ingredients before optional ingredients
    let startingIngredients: any = [...recipe.ingredients].sort(
      ({ isOptional: a }, { isOptional: b }) => Number(b) - Number(a)
    );
    while (startingIngredients.length) {
      const recipeIngredient = startingIngredients.pop();

      const isAdded = addedIngredients.find(({ id }) => id === recipeIngredient.id);
      if (!isAdded) {
        addedIngredients.push(recipeIngredient);

        const ingredientRecipe = recipes.find(({ id }) => id === recipeIngredient.id);
        if (ingredientRecipe) {
          const recipeIngredients = ingredientRecipe.ingredients.map(current => {
            // recipe ingredient should allow optional
            return new RecipeIngredient({
              ...current,
              isOptional: current.isOptional || recipeIngredient.isOptional,
            });
          });
          startingIngredients = startingIngredients.concat(recipeIngredients);
        }
      } else {
        // recipe ingredient should always prioritize required
        isAdded.isOptional = isAdded.isOptional && recipeIngredient.isOptional;
      }
    }

    return addedIngredients.filter(({ uom }) => uom !== UOM.RECIPE);
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
        .filter(({ isOptional }) => !isOptional)
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
    callback?: Function
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
    recipeIngredients.forEach(recipeIngredient => {
      const ingredient = ingredients.find(({ id }) => id === recipeIngredient.id);
      if (!ingredient) {
        return;
      }

      const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
      const convertedValue = this.uomService.convert(
        recipeIngredient.uom,
        ingredient.uom,
        quantity
      );
      if (!convertedValue) {
        this.notificationService.setModal(new FailureNotification('Calculation error!'));
        return;
      }

      const cartQuantity = Math.ceil(convertedValue / Number(ingredient.amount));

      const userIngredient = userIngredients.find(
        ({ ingredientId }) => ingredientId === recipeIngredient.id
      );
      if (userIngredient) {
        userIngredient.cartQuantity += cartQuantity;
      } else {
        userIngredients.push(
          new UserIngredient({
            uid: householdId,
            ingredientId: String(recipeIngredient.id),
            cartQuantity: cartQuantity,
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
