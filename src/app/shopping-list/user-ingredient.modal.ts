export class UserIngredient {
    key: string;
    uid: string;
    ingredients: Array<{
        key: string;
        pantryQuantity: string;
        cartQuantity: string;
    }>;

    constructor(
        key: string,
        uid: string,
        ingredients: Array<{
            key: string,
            pantryQuantity: string,
            cartQuantity: string,
        }>
    ) {
        this.key = key;
        this.uid = uid;
        this.ingredients = ingredients;
    }

    public getId() {
        return this.key;
    }

    public getObject() {
        return {
            uid: this.uid,
            ingredients: this.ingredients,
        };
    }
}
