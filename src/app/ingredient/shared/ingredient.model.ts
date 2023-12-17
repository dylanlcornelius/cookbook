import { Model } from '@model';
import { UOM } from '@uoms';

export class Ingredient extends Model {
  name: string;
  category: string;
  amount: string;
  uom: UOM;
  calories: string;

  cartQuantity: number;
  displayCategory: string;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.category = data.category || 'Other';
    this.amount = data.amount || '';
    this.uom = data.uom || '';
    this.calories = data.calories || '';
    this.cartQuantity = data.cartQuantity;
  }

  public getObject(): IngredientObject {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { id, cartQuantity, displayCategory, ...ingredient } = this;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return ingredient;
  }
}

export type IngredientObject = Omit<
  Ingredient,
  'id' | 'getId' | 'getObject' | 'cartQuantity' | 'displayCategory'
>;

export type Ingredients = Ingredient[];
