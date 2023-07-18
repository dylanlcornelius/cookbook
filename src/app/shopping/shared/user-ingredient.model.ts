import { Model } from '@model';
import { UOM } from '@uoms';

export class UserIngredient extends Model {
  uid: string;
  ingredientId: string;
  pantryQuantity: number | string;
  cartQuantity: number;

  amount: string;
  uom: UOM;

  constructor(data: any) {
    super(data);
    this.uid = data.uid;
    this.ingredientId = data.ingredientId || '';
    this.pantryQuantity = data.pantryQuantity || 0;
    this.cartQuantity = data.cartQuantity || 0;
    this.amount = data.amount;
    this.uom = data.uom;
  }

  public getObject(): UserIngredientObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, amount, uom, ...userIngredient } = this;
    return userIngredient;
  }
}

export type UserIngredientObject = Omit<
  UserIngredient,
  'id' | 'getId' | 'getObject' | 'amount' | 'uom'
>;
