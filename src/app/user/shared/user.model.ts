import { Model } from '@model';

export class User extends Model {
    uid: string;
    firstName: string;
    lastName: string;
    defaultShoppingList: string;
    role: string;
    theme: boolean;
    simplifiedView: boolean;
    hasImage: boolean;

    isAdmin: boolean;
    isPending: boolean;
    recipeCount: number;
    ratingCount: number;
    image: string;

    constructor(data) {
        super(data);
        this.uid = data.uid || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.defaultShoppingList = data.defaultShoppingList || data.uid || '';
        this.role = data.role || '';
        this.theme = data.theme || false;
        this.simplifiedView = data.simplifiedView || false;
        this.hasImage = data.hasImage || false;
        this.isAdmin = data.role === 'admin';
        this.isPending = data.role === 'pending';
    }

    public getObject() {
        const {id, isAdmin, isPending, recipeCount, ratingCount, image, ...user} = this;
        return user;
    }
}
