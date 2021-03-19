import { Model } from '@model';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';

export class UserIngredient extends Model {
    uid: string;
    ingredients: Array<Ingredient>;

    constructor(data) {
        super();
        this.id = data.id || '';
        this.uid = data.uid;
        this.ingredients = data.ingredients || [];
    }

    public getObject() {
        const {id, ...userIngredient} = this;
        return userIngredient;
    }
}
