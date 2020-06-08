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

    constructor(data) {
        this.id = data.id;
        this.uid = data.uid;
        this.ingredients = data.ingredients;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        const {id, ...userIngredient} = this;
        return userIngredient;
    }
}
