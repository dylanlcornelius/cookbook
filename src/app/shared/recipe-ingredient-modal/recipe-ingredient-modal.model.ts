import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';

export class RecipeIngredientModal {
    function: Function;
    ingredients: Ingredient[];
    userIngredient: UserIngredient;
    defaultShoppingList: string;
    self;

    constructor(
        eventFunction: Function,
        ingredients: Ingredient[],
        userIngredient: UserIngredient,
        defaultShoppingList: string,
        self
    ) {
        this.function = eventFunction;
        this.ingredients = ingredients;
        this.userIngredient = userIngredient;
        this.defaultShoppingList = defaultShoppingList;
        this.self = self;
    }
}
