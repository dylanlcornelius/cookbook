import { Model } from '@model';

export class Household extends Model {
    name: string;
    members: Array<Member>;
    memberIds: Array<string>;
    invites: Array<Member>;
    inviteIds: Array<string>;

    constructor(data: any) {
        super(data);
        this.name = data.name || '';
        this.members = data.members || [];
        this.memberIds = data.memberIds || [];
        this.invites = data.invites || [];
        this.inviteIds = data.inviteIds || [];
    }
}

export class Member {
    uid: string;
    name?: string;
    inviter?: string;
    inviterName?: string;
}
