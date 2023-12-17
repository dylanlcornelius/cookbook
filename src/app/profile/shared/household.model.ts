import { Model } from '@model';

export class Household extends Model {
  name: string;
  members: Members;
  memberIds: string[];
  invites: Members;
  inviteIds: string[];

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.members = data.members || [];
    this.memberIds = data.memberIds || [];
    this.invites = data.invites || [];
    this.inviteIds = data.inviteIds || [];
  }
}

export type Households = Household[];

export class Member {
  uid: string;
  name?: string;
  inviter?: string;
  inviterName?: string;
}

export type Members = Member[];
