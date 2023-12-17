import { Model } from '@model';

export class UserItem extends Model {
  uid: string;
  name: string;

  constructor(data: any) {
    super(data);
    this.uid = data.uid;
    this.name = data.name || '';
  }
}

export type UserItems = UserItem[];
