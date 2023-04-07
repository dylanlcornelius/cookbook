import { Modal } from '@modalService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';

export class RecipeIngredientModal extends Modal {
    function: Function;
    recipeName: string;
    ingredients: Ingredient[];
    userIngredients: UserIngredient[];
    householdId: string;
    callback: Function;

    constructor(
        eventFunction: Function,
        recipeName: string,
        ingredients: Ingredient[],
        userIngredients: UserIngredient[],
        householdId: string,
        callback?: Function,
    ) {
        super();
        this.function = eventFunction;
        this.recipeName = recipeName;
        this.ingredients = ingredients;
        this.userIngredients = userIngredients;
        this.householdId = householdId;
        this.callback = callback;
    }
}
