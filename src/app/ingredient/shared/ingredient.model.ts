import { UOM } from './uom.emun';

export class Ingredient {
    id: string;
    name: string;
    category: string;
    amount: string;
    uom: UOM;
    calories: string;

    quantity: Number;
    pantryQuantity: Number;
    cartQuantity: Number;

    constructor (data) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.category = data.category || '';
        this.amount = data.amount || '';
        this.uom = data.uom || '';
        this.calories = data.calories || '';
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            name: this.name,
            category: this.category,
            amount: this.amount,
            uom: this.uom,
            calories: this.calories,
        };
    }
}
