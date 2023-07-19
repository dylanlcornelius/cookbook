import { Ingredient } from '@ingredient';
import { OptionalIngredientsPipe } from './optional-ingredients.pipe';

describe('OptionalIngredientsPipe', () => {
  const pipe = new OptionalIngredientsPipe();

  it('should return a filtered list of ingredients', () => {
    const optional = new Ingredient({ isOptional: true });
    const required = new Ingredient({});
    const ingredients = [optional, required];

    const result = pipe.transform(ingredients, true);

    expect(result).toEqual([optional]);
  });
});
