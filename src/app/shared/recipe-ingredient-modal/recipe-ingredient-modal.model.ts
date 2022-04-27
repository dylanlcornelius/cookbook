import { Modal } from '@modalService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';

export class RecipeIngredientModal extends Modal {
    function: Function;
    recipeName: string;
    ingredients: Ingredient[];
    userIngredient: UserIngredient;
    householdId: string;
    callback: Function;

    constructor(
        eventFunction: Function,
        recipeName: string,
        ingredients: Ingredient[],
        userIngredient: UserIngredient,
        householdId: string,
        callback?: Function,
    ) {
        super();
        this.function = eventFunction;
        this.recipeName = recipeName;
        this.ingredients = ingredients;
        this.userIngredient = userIngredient;
        this.householdId = householdId;
        this.callback = callback;
    }
}
