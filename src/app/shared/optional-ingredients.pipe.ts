import { Pipe, PipeTransform } from '@angular/core';
import { Ingredient } from '@ingredient';

@Pipe({
  name: 'filterOptional'
})
export class OptionalIngredientsPipe implements PipeTransform {
  transform(items: Ingredient[], isOptional: boolean): Ingredient[] {
    return items?.filter(item => item.isOptional === isOptional);
  }
}
