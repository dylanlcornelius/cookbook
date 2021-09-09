import { Model } from '@model';
import { Ingredient } from '@ingredient';

export class UserIngredient extends Model {
    uid: string;
    ingredients: Array<Ingredient>;

    constructor(data: any) {
        super(data);
        this.uid = data.uid;
        this.ingredients = data.ingredients || [];
    }
}
