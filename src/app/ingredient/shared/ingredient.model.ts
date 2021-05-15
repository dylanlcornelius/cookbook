import { Model } from '@model';
import { UOM } from '@UOMConverson';

export class Ingredient extends Model {
    name: string;
    category: string;
    amount: string;
    uom: UOM;
    calories: string;

    quantity: number;
    pantryQuantity: number;
    cartQuantity: number;
    selected: Boolean;

    constructor (data) {
        super(data);
        this.name = data.name || '';
        this.category = data.category || '';
        this.amount = data.amount || '';
        this.uom = data.uom || '';
        this.calories = data.calories || '';
    }

    public getObject() {
        const {id, quantity, pantryQuantity, cartQuantity, selected, ...ingredient} = this;
        return ingredient;
    }
}
