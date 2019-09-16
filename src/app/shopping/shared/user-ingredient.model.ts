export class UserIngredient {
    id: string;
    uid: string;
    ingredients: Array<{
        id: string,
        pantryQuantity: number,
        cartQuantity: number,

        uom: string,
        amount: string,
    }>;

    constructor(
        uid: string,
        ingredients: Array<{
            id: string,
            pantryQuantity: number,
            cartQuantity: number,
            uom: string,
            amount: string,
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
