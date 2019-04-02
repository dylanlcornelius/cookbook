export class User {
    id: string;
    uid: string;
    firstName: string;
    lastName: string;
    role: string;

    constructor(id: string, uid: string, firstName: string, lastName: string, role: string) {
        this.id = id;
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
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
        };
    }
}
