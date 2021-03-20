import { Model } from '@model';

export class UserItem extends Model {
    uid: string;
    items: Array<{
        name: string
    }>;

    constructor(data) {
        super();
        this.id = data.id || '';
        this.uid = data.uid;
        this.items = data.items || [];
    }

    public getObject() {
        const {id, ...userItem} = this;
        return userItem;
    }
}
