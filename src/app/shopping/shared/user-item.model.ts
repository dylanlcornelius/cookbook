export class UserItem {
    id: string;
    uid: string;
    items: Array<{
        id: string;
        cartQuantity: number;
    }>;

    constructor(data) {
        this.id = data.id;
        this.uid = data.uid;
        this.items = data.items;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            uid: this.uid,
            items: this.items,
        };
    }
}
