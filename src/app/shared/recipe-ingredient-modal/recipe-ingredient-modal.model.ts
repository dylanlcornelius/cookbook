import { Modal } from '@modalService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';
import { Recipe } from '@recipe';

export class RecipeIngredientModal extends Modal {
  function: Function;
  recipe: Recipe;
  recipes: Recipe[];
  ingredients: Ingredient[];
  userIngredients: UserIngredient[];
  uid: string;
  householdId: string;
  callback: Function;

  constructor(
    eventFunction: Function,
    recipe: Recipe,
    recipes: Recipe[],
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
    this.ingredients = ingredients;
    this.userIngredients = userIngredients;
    this.uid = uid;
    this.householdId = householdId;
    this.callback = callback;
  }
}
