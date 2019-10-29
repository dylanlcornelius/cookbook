export class Recipe {
    id: string;
    name: string;
    description: string;
    time: string;
    calories: string;
    servings: string;
    quantity: string;
    categories: Array<{
        category: string,
    }>;
    steps: Array<string>;
    ingredients: Array<{
        id: string,
        uom: string,
        quantity: string,
        amount: string,
    }>;
    uid: string;
    author: string;

    count: Number;
    image: string;

    constructor(
        name: string,
        description: string,
        time: string,
        calories: string,
        servings: string,
        quantity: string,
        categories: Array<{
            category: string,
        }>,
        steps: Array<string>,
        ingredients: Array<{
            id: string,
            uom: string,
            quantity: string,
            amount: string
        }>,
        uid: string,
        author: string,
        id?: string,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.time = time;
        this.calories = calories;
        this.servings = servings;
        this.quantity = quantity;
        this.categories = categories;
        this.steps = steps;
        this.ingredients = ingredients;
        this.uid = uid;
        this.author = author;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            name: this.name,
            description: this.description,
            time: this.time,
            calories: this.calories,
            servings: this.servings,
            quantity: this.quantity,
            categories: this.categories,
            steps: this.steps,
            ingredients: this.ingredients,
            uid: this.uid,
            author: this.author,
        };
    }
}
