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

    constructor (data: any) {
        super(data);
        this.name = data.name || '';
        this.category = data.category || '';
        this.amount = data.amount || '';
        this.uom = data.uom || '';
        this.calories = data.calories || '';
        this.pantryQuantity = data.pantryQuantity;
        this.cartQuantity = data.cartQuantity;
    }

    public getObject(): IngredientObject {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id, quantity, pantryQuantity, cartQuantity, selected, ...ingredient} = this;
        return ingredient;
    }
}

export type IngredientObject = Omit<Ingredient, 'id' | 'quantity' | 'pantryQuantity' | 'cartQuantity' | 'selected'>;
