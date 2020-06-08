export class UserItem {
    id: string;
    uid: string;
    items: Array<{
        name: string
    }>;

    constructor(data) {
        this.id = data.id || '';
        this.uid = data.uid;
        this.items = data.items || [];
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        const {id, ...userItem} = this;
        return userItem;
    }
}
