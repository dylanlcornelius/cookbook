export class Recipe {
    id: string;
    name: string;
    link: string;
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
    ratings: Array<{
        uid: string,
        rating: number,
    }>;
    uid: string;
    author: string;

    count: Number;
    image: string;

    constructor(data) {
        this.id = data.id || '';
        this.name = data.name || '';
        this.link = data.link || '';
        this.description = data.description || '';
        this.time = data.time || '';
        this.calories = data.calories || '';
        this.servings = data.servings || '';
        this.quantity = data.quantity || '';
        this.categories = data.categories || [];
        this.steps = data.steps || [];
        this.ingredients = data.ingredients || [];
        this.ratings = data.ratings || [];
        this.uid = data.uid || '';
        this.author = data.author || '';
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
            ratings: this.ratings,
            uid: this.uid,
            author: this.author,
        };
    }
}
