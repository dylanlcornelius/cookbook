export class User {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    role: string;
    theme: boolean;
    simplifiedView: boolean;

    constructor(uid: string, firstName: string, lastName: string, role: string, theme: boolean, simplifiedView: boolean, id?: string) {
        this.id = id;
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.theme = theme;
        this.simplifiedView = simplifiedView;
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
