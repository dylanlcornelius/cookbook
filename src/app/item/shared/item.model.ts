export class Item {
    id: string;
    uid: string;
    name: string;

    cartQuantity: Number;

    constructor(data) {
        this.id = data.id || '';
        this.uid = data.uid || '';
        this.name = data.name || '';
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            uid: this.uid,
            name: this.name,
        };
    }
}
