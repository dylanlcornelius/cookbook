import { Modal } from '@modalService';
import { Ingredients } from '@ingredient';
import { UserIngredients } from '@userIngredient';
import { Recipe, Recipes } from '@recipe';
import { RecipeIngredients } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';

export class RecipeIngredientModal extends Modal {
  function: RecipeIngredientService['addIngredientsEvent'];
  recipe: Recipe;
  recipes: Recipes;
  recipeIngredients: RecipeIngredients;
  ingredients: Ingredients;
  userIngredients: UserIngredients;
  uid: string;
  householdId: string;
  callback: Function;

  constructor(
    eventFunction: RecipeIngredientService['addIngredientsEvent'],
    recipe: Recipe,
    recipes: Recipes,
    recipeIngredients: RecipeIngredients,
    ingredients: Ingredients,
    userIngredients: UserIngredients,
    uid: string,
    householdId: string,
    callback?: Function
  ) {
    super();
    this.function = eventFunction;
    this.recipe = recipe;
    this.recipes = recipes;
    this.recipeIngredients = recipeIngredients;
    this.ingredients = ingredients;
    this.userIngredients = userIngredients;
    this.uid = uid;
    this.householdId = householdId;
    this.callback = callback;
  }
}
