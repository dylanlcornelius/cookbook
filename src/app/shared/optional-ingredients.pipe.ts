import { Pipe, PipeTransform } from '@angular/core';
import { RecipeIngredient } from '@recipeIngredient';

@Pipe({
  name: 'filterOptional',
})
export class OptionalIngredientsPipe implements PipeTransform {
  transform(items: RecipeIngredient[], isOptional: boolean): RecipeIngredient[] {
    return items?.filter(item => item.isOptional === isOptional);
  }
}
