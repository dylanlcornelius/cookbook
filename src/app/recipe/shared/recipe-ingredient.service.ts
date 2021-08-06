import { Injectable } from '@angular/core';
import { UOM, UOMConversion } from '@UOMConverson';
import { FailureNotification, InfoNotification, SuccessNotification } from '@notification';
import { NotificationService, RecipeIngredientModalService } from '@modalService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredientService } from '@userIngredientService';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { Recipe } from '@recipe';
import { UserIngredient } from '@userIngredient';
import { NumberService } from 'src/app/util/number.service';
import { Ingredient } from '@ingredient';

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientService {
  constructor(
    private recipeIngredientModalService: RecipeIngredientModalService,
    private uomConversion: UOMConversion,
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
    const addedIngredients = [];

    let startingIngredients = [...recipe.ingredients];
    while (startingIngredients.length) {
      const ingredient = startingIngredients.pop();

      const isAdded = addedIngredients.find(({ id }) => id === ingredient.id);
      if (!isAdded) {
        addedIngredients.push(ingredient);

        const ingredientRecipe = recipes.find(({ id }) => id === ingredient.id);
        if (ingredientRecipe) {
          startingIngredients = startingIngredients.concat(ingredientRecipe.ingredients);
        }
      }
    }

    return addedIngredients.filter(({ uom }) => uom !== UOM.RECIPE);
  }

  getRecipeCount(recipe, recipes, { ingredients }) {
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
          const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, quantity);
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

  addIngredients(recipe: Recipe, recipes: Recipe[], userIngredient, defaultShoppingList) {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    if (recipeIngredients.length > 0) {
      this.recipeIngredientModalService.setModal(new RecipeIngredientModal(
        this.addIngredientsEvent,
        recipeIngredients,
        userIngredient,
        defaultShoppingList,
      ));
    } else {
      this.notificationService.setModal(new InfoNotification('Recipe has no ingredients'));
    }
  }

  addIngredientsEvent = (recipeIngredients, { id, ingredients }, defaultShoppingList) => {
    recipeIngredients.forEach(recipeIngredient => {
      let hasIngredient = false;
      ingredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
          const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, quantity);
          if (value) {
            ingredient.cartQuantity += ingredient.amount * Math.ceil(value / ingredient.amount);
          } else {
            this.notificationService.setModal(new FailureNotification('Calculation error!'));
          }
          hasIngredient = true;
        }
      });
      if (!hasIngredient) {
        ingredients.push({
          id: String(recipeIngredient.id),
          pantryQuantity: 0,
          cartQuantity: Number(recipeIngredient.amount)
        });
      }
    });

    this.userIngredientService.formattedUpdate(ingredients, defaultShoppingList, id);
    this.notificationService.setModal(new SuccessNotification('Added to list!'));
  }

  removeIngredients(recipe: Recipe, recipes: Recipe[], { id, ingredients }: UserIngredient, defaultShoppingList: string) {
    const recipeIngredients = this.findRecipeIngredients(recipe, recipes);

    if (recipeIngredients.length) {
      recipeIngredients.forEach(recipeIngredient => {
        ingredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            const quantity = this.numberService.toDecimal(recipeIngredient.quantity);
            const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, quantity);
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
      this.userIngredientService.formattedUpdate(ingredients, defaultShoppingList, id);
    }

    this.recipeHistoryService.add(defaultShoppingList, recipe.id);
    this.notificationService.setModal(new SuccessNotification('Recipe cooked!'));
  }
}
