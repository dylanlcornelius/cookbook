import { Model } from '@model';
import { UOM } from '@uoms';

export class Ingredient extends Model {
  name: string;
  category: string;
  /** volume amount */
  amount: string;
  /** volume unit of measurement */
  uom: UOM;
  /** weight amount */
  altAmount: string;
  /** weight unit of measurement */
  altUOM: UOM;
  buyableUOM: 'volume' | 'weight';
  calories: string;

  cartQuantity: number;
  displayCategory: string;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.category = data.category || 'Other';
    this.amount = data.amount || '';
    this.uom = data.uom || '';
    this.altAmount = data.altAmount || '';
    this.altUOM = data.altUOM || '';
    this.buyableUOM = data.buyableUOM || 'volume';
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
