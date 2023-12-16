import { Modal } from '@modalService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';
import { Recipe } from '@recipe';
import { RecipeIngredient } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';

export class RecipeIngredientModal extends Modal {
  function: RecipeIngredientService['addIngredientsEvent'];
  recipe: Recipe;
  recipes: Recipe[];
  recipeIngredients: RecipeIngredient[];
  ingredients: Ingredient[];
  userIngredients: UserIngredient[];
  uid: string;
  householdId: string;
  callback: Function;

  constructor(
    eventFunction: RecipeIngredientService['addIngredientsEvent'],
    recipe: Recipe,
    recipes: Recipe[],
    recipeIngredients: RecipeIngredient[],
    ingredients: Ingredient[],
    userIngredients: UserIngredient[],
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
