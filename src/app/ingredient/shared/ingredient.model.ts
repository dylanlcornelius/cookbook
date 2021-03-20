import { Model } from '@model';
import { UOM } from './uom.emun';

export class Ingredient extends Model {
    name: string;
    category: string;
    amount: string;
    uom: UOM;
    calories: string;

    quantity: Number;
    pantryQuantity: Number;
    cartQuantity: Number;

    constructor (data) {
        super();
        this.id = data.id || '';
        this.name = data.name || '';
        this.category = data.category || '';
        this.amount = data.amount || '';
        this.uom = data.uom || '';
        this.calories = data.calories || '';
    }

    public getObject() {
        const {id, quantity, pantryQuantity, cartQuantity, ...ingredient} = this;
        return ingredient;
    }
}
