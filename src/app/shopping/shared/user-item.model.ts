import { Model } from '@model';

export class UserItem extends Model {
    uid: string;
    items: Array<{
        name: string
    }>;

    constructor(data) {
        super(data);
        this.uid = data.uid;
        this.items = data.items || [];
    }
}
