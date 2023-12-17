import { Pipe, PipeTransform } from '@angular/core';
import { RecipeIngredients } from '@recipeIngredient';

@Pipe({
  name: 'filterOptional',
})
export class OptionalIngredientsPipe implements PipeTransform {
  transform(items: RecipeIngredients, isOptional: boolean): RecipeIngredients {
    return items?.filter(item => item.isOptional === isOptional);
  }
}
