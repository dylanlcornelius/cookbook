import { Model } from '@model';
import { UOM } from '@uoms';

export class Ingredient extends Model {
  name: string;
  category: string;
  amount: string;
  uom: UOM;
  calories: string;

  quantity: number;
  pantryQuantity: number | string;
  cartQuantity: number;
  selected: boolean;
  isOptional: boolean;
  displayCategory: string;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.category = data.category || 'Other';
    this.amount = data.amount || '';
    this.uom = data.uom || '';
    this.calories = data.calories || '';
    this.quantity = data.quantity;
    this.pantryQuantity = data.pantryQuantity;
    this.cartQuantity = data.cartQuantity;
    this.selected = data.selected;
    this.isOptional = data.isOptional || false;
  }

  public getObject(): IngredientObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {
      id,
      quantity,
      pantryQuantity,
      cartQuantity,
      selected,
      isOptional,
      displayCategory,
      ...ingredient
    } = this;
    return ingredient;
  }
}

export type IngredientObject = Omit<
  Ingredient,
  | 'id'
  | 'getId'
  | 'getObject'
  | 'quantity'
  | 'pantryQuantity'
  | 'cartQuantity'
  | 'selected'
  | 'isOptional'
  | 'displayCategory'
>;
