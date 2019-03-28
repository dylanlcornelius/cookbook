export class UserIngredient {
    id: string;
    uid: string;
    ingredients: Array<{
        id: string;
        pantryQuantity: string;
        cartQuantity: string;
    }>;

    constructor(
        uid: string,
        ingredients: Array<{
            id: string,
            pantryQuantity: string,
            cartQuantity: string,
        }>,
        id?: string,
    ) {
        this.id = id;
        this.uid = uid;
        this.ingredients = ingredients;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            uid: this.uid,
            ingredients: this.ingredients,
        };
    }
}
