export class UserIngredient {
    key: string;
    uid: string;
    ingredients: Array<{
        ingredient: string;
        pantryQuantity: string;
        cartQuantity: string;
    }>;
}
