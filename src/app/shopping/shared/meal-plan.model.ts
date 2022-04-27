import { Model } from '@model';
import { Recipe } from '@recipe';

export class MealPlan extends Model {
    uid: string;
    recipes: Array<Recipe>;

    constructor(data: any) {
        super(data);
        this.uid = data.uid;
        this.recipes = data.recipes || [];
    }
}
