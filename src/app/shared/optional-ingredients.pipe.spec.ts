import { OptionalIngredientsPipe } from './optional-ingredients.pipe';
import { RecipeIngredient } from '@recipeIngredient';

describe('OptionalIngredientsPipe', () => {
  const pipe = new OptionalIngredientsPipe();

  it('should return a filtered list of ingredients', () => {
    const optional = new RecipeIngredient({ isOptional: true });
    const required = new RecipeIngredient({});
    const ingredients = [optional, required];

    const result = pipe.transform(ingredients, true);

    expect(result).toEqual([optional]);
  });
});
