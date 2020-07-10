export class User {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    theme: boolean;
    simplifiedView: boolean;

    isAdmin: boolean;
    isPending: boolean;

    constructor(data) {
        this.id = data.id || '';
        this.uid = data.uid || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.role = data.role || '';
        this.theme = data.theme || false;
        this.simplifiedView = data.simplifiedView || false;
        this.isAdmin = data.role === 'admin';
        this.isPending = data.role === 'pending';
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        const {id, isAdmin, isPending, ...user} = this;
        return user;
    }
}
