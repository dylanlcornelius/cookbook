import { Model } from '@model';

export class User extends Model {
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    theme: boolean;
    hasImage: boolean;

    name: string;
    isAdmin: boolean;
    isPending: boolean;
    recipeCount: number;
    ratingCount: number;
    image: string;

    constructor(data: any) {
        super(data);
        this.uid = data.uid || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.name = `${this.firstName} ${this.lastName}`;
        this.role = data.role || '';
        this.theme = data.theme || false;
        this.hasImage = data.hasImage || false;
        this.isAdmin = data.role === 'admin';
        this.isPending = data.role === 'pending';
    }

    public getObject(): UserObject {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {id, name, isAdmin, isPending, recipeCount, ratingCount, image, ...user} = this;
        return user;
    }
}

export type UserObject = Omit<User, 'id' | 'name' | 'isAdmin' | 'isPending' | 'recipeCount' | 'ratingCount' | 'image'>;
