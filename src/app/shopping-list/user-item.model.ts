export class UserItem {
    id: string;
    uid: string;
    items: Array<{
        id: string;
        cartQuantity: number;
    }>;

    constructor(
        uid: string,
        items: Array<{
            id: string,
            cartQuantity: number,
        }>,
        id?: string,
    ) {
        this.id = id;
        this.uid = uid;
        this.items = items;
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
