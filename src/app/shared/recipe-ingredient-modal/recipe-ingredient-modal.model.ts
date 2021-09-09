import { Modal } from '@modalService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';

export class RecipeIngredientModal extends Modal {
    function: Function;
    ingredients: Ingredient[];
    userIngredient: UserIngredient;
    defaultShoppingList: string;

    constructor(
        eventFunction: Function,
        ingredients: Ingredient[],
        userIngredient: UserIngredient,
        defaultShoppingList: string,
    ) {
        super();
        this.function = eventFunction;
        this.ingredients = ingredients;
        this.userIngredient = userIngredient;
        this.defaultShoppingList = defaultShoppingList;
    }
}
