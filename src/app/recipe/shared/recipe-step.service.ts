import { Injectable } from '@angular/core';
import { Recipe, Recipes } from '@recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeStepService {
  /**
   * Iterative version of building recipe steps (postorder traversal)
   * @param recipe recipe to find steps for
   * @param recipes all recipes
   * @returns steps
   */
  buildRecipeSteps(recipe: Recipe, recipes: Recipes): Recipe['steps'] {
    const startingRecipes = [recipe];
    const finalRecipes: Recipes = [];

    while (startingRecipes.length) {
      const current = startingRecipes.pop()!;
      finalRecipes.push(current);

      current.steps.forEach(({ recipeId }) => {
        if (recipeId && finalRecipes.every(({ id }) => id !== recipeId)) {
          const recipe = recipes.find(({ id }) => id === recipeId);
          if (recipe) {
            startingRecipes.push(recipe);
          }
        }
      });
    }

    while (finalRecipes.length) {
      const current = finalRecipes.pop()!;

      current.steps = current.steps.map(({ step, recipeId }) => {
        // TODO: if necessary (any recipe ingredients loop), remove duplicate recipeIds that have already been added to any step
        if (recipeId) {
          const recipe = recipes.find(({ id }) => id === recipeId);
          return {
            recipeId,
            recipeName: recipe?.name,
            recipeSteps: recipe?.steps,
          };
        }
        return { step };
      });
    }

    return recipe.steps;
  }
}
