export class RecipeHistory {
    id: string;
    uid: string;
    recipeId: string
    history: Array<string>;
    timesCooked: number;
    lastDateCooked: string;

    constructor(data: any = {}) {
        this.id = data.id || '';
        this.uid = data.uid;
        this.recipeId = data.recipeId;
        this.history = data.history || [];
        this.timesCooked = data.timesCooked || 0;
        this.lastDateCooked = data.lastDateCooked || '';
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        const {id, ...recipeHistory} = this;
        return recipeHistory;
    }
}
