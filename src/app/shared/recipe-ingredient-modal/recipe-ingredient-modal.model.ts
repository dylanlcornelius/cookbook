import { Ingredients } from '@ingredient';
import { UserIngredients } from '@userIngredient';
import { Recipe, Recipes } from '@recipe';
import { RecipeIngredients } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';
import { MealPlannerComponent } from 'src/app/shopping/meal-planner/meal-planner.component';

export class RecipeIngredientModal {
  function: RecipeIngredientService['addIngredientsEvent'];
  recipe: Recipe;
  recipes: Recipes;
  recipeIngredients: RecipeIngredients;
  ingredients: Ingredients;
  userIngredients: UserIngredients;
  uid: string;
  householdId: string;
  callback: MealPlannerComponent['addAllIngredients'];

  constructor(
    eventFunction: RecipeIngredientService['addIngredientsEvent'],
    recipe: Recipe,
    recipes: Recipes,
    recipeIngredients: RecipeIngredients,
    ingredients: Ingredients,
    userIngredients: UserIngredients,
    uid: string,
    householdId: string,
    callback?: MealPlannerComponent['addAllIngredients']
  ) {
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
