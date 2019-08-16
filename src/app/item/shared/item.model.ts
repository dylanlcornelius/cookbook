export class Item {
    id: string;
    uid: string;
    name: string;

    constructor(
        uid: string,
        name: string,
        id?: string,
    ) {
        this.id = id;
        this.uid = uid;
        this.name = name;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            uid: this.uid,
            name: this.name,
        };
    }
}
