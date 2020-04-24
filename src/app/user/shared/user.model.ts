export class User {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    theme: boolean;
    simplifiedView: boolean;

    constructor(data) {
        this.id = data.id || '';
        this.uid = data.uid || '';
        this.firstName = data.firstName || '';
        this.lastName = data.lastName || '';
        this.role = data.role || '';
        this.theme = data.theme || false;
        this.simplifiedView = data.simplifiedView || false;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            uid: this.uid,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            theme: this.theme,
            simplifiedView: this.simplifiedView,
        };
    }

    public isAdmin() { return this.role === 'admin'; }
    public isPending() { return this.role === 'pending'; }
}
