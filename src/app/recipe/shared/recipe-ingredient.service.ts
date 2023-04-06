import { Injectable } from '@angular/core';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { FailureNotification, InfoNotification, SuccessNotification } from '@notification';
import { NotificationService, RecipeIngredientModalService } from '@modalService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredientService } from '@userIngredientService';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { Recipe } from '@recipe';
import { UserIngredient } from '@userIngredient';
import { Ingredient } from '@ingredient';
import { NumberService } from '@numberService';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientService {
  constructor(
    private recipeIngredientModalService: RecipeIngredientModalService,
    private uomService: UomService,
    private notificationService: NotificationService,
    private recipeHistoryService: RecipeHistoryService,
    private userIngredientService: UserIngredientService,
    private numberService: NumberService,
  ) { }

  /**
   * Iterative version of finding recipe ingredients
   * Doesn't combine duplicate ingredient quantities (buyable amounts should handle quantities)
   * @param recipe recipe to find ingredients for
   * @param recipes all recipes
   * @returns ingredients
   */
  findRecipeIngredients(recipe: Recipe, recipes: Recipe[]): Ingredient[] {
    const addedIngredients: Ingredient[] = [];

    // sort required ingredients before optional ingredients
    let startingIngredients = [...recipe.ingredients]
      .sort(({isOptional: a}, {isOptional: b}) => Number(b) - Number(a));
    while (startingIngredients.length) {
      const ingredient = startingIngredients.pop();

      const isAdded = addedIngredients.find(({ id }) => id === ingredient.id);
      if (!isAdded) {
        addedIngredients.push(ingredient);

        const ingredientRecipe = recipes.find(({ id }) => id === ingredient.id);
        if (ingredientRecipe) {
          const recipeIngredients = ingredientRecipe.ingredients;
          recipeIngredients.forEach(current => {
            // recipe ingredient should allow optional
            current.isOptional = current.isOptional || ingredient.isOptional;
          });
          startingIngredients = startingIngredients.concat(recipeIngredients);
        }
      } else {
        // ingredient should always prioritize required
        isAdded.isOptional = isAdded.isOptional && ingredient.isOptional;
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
  findRecipeIds(recipe: Recipe, recipes: Recipe[]): string[] {
    const addedRecipes: Ingredient[] = [];

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

    return addedRecipes.filter(({ uom }) => uom === UOM.RECIPE).map(({ id }) => id).concat(recipe.id);
  }

  getRecipeCount(recipe: Recipe, recipes: Recipe[], { ingredients }: UserIngredient): number {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    let recipeCount;
    let ingredientCount = 0;
    if (recipeIngredients.length === 0 || ingredients.length === 0) {
      return 0;
    }
    recipeIngredients.forEach(recipeIngredient => {
      // handle deleted ingredients
      if (recipeIngredient.name === null) {
        ingredientCount++;
        return;
      }

      ingredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          ingredientCount++;
          
          const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
          const value = this.uomService.convert(recipeIngredient.uom, ingredient.uom, quantity);
          if (value && (Number(ingredient.pantryQuantity) / Number(value) < recipeCount || recipeCount === undefined)) {
            recipeCount = Math.floor(Number(ingredient.pantryQuantity) / Number(value));
          }
        }
      });
    });

    // user doesn't have all recipe ingredients
    if (ingredientCount !== recipeIngredients.length || recipeCount === undefined) {
      return 0;
    }
    return recipeCount;
  }

  addIngredients(recipe: Recipe, recipes: Recipe[], userIngredient: UserIngredient, householdId: string, callback?: Function): void {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    if (recipeIngredients.length > 0) {
      this.recipeIngredientModalService.setModal(new RecipeIngredientModal(
        this.addIngredientsEvent,
        recipe.name,
        recipeIngredients,
        userIngredient,
        householdId,
        callback
      ));
    } else {
      this.notificationService.setModal(new InfoNotification('Recipe has no ingredients'));
      callback?.();
    }
  }

  addIngredientsEvent = (recipeIngredients: Ingredient[], { id, ingredients }: UserIngredient, householdId: string): void => {
    recipeIngredients.forEach(recipeIngredient => {
      let hasIngredient = false;
      ingredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
          const value = this.uomService.convert(recipeIngredient.uom, ingredient.uom, quantity);
          if (value) {
            ingredient.cartQuantity += Number(ingredient.amount) * Math.ceil(value / Number(ingredient.amount));
          } else {
            this.notificationService.setModal(new FailureNotification('Calculation error!'));
          }
          hasIngredient = true;
        }
      });
      if (!hasIngredient) {
        ingredients.push(new Ingredient({
          id: String(recipeIngredient.id),
          pantryQuantity: 0,
          cartQuantity: Number(recipeIngredient.amount)
        }));
      }
    });

    this.userIngredientService.formattedUpdate(ingredients, householdId, id);
    this.notificationService.setModal(new SuccessNotification('Added to list!'));
  };

  removeIngredients(recipe: Recipe, recipes: Recipe[], { id, ingredients }: UserIngredient, uid: string, householdId: string): void {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    if (recipeIngredients.length) {
      recipeIngredients.forEach(recipeIngredient => {
        ingredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
            const value = this.uomService.convert(recipeIngredient.uom, ingredient.uom, quantity);
            if (Number.isNaN(ingredient.pantryQuantity)) {
              ingredient.pantryQuantity = 0;
            } else if (value !== false) {
              ingredient.pantryQuantity = Math.max(Number(ingredient.pantryQuantity) - Number(value), 0);
            } else {
              this.notificationService.setModal(new FailureNotification('Calculation error!'));
            }
          }
        });
      });
      this.userIngredientService.formattedUpdate(ingredients, householdId, id);
    }

    const cookedRecipeIds = this.findRecipeIds(recipe, recipes);
    cookedRecipeIds.forEach(recipeId => {
      this.recipeHistoryService.add(uid, recipeId);
      if (householdId !== uid) {
        this.recipeHistoryService.add(householdId, recipeId);
      }
    });
    this.notificationService.setModal(new SuccessNotification('Recipe cooked!'));
  }
}
