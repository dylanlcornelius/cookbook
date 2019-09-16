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

    constructor (name: string, category: string, amount: string, uom: UOM, calories: string, id?: string) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.amount = amount;
        this.uom = uom;
        this.calories = calories;
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
