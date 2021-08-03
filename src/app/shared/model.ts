export abstract class Model {
    id: string;
    creationDate: Date;

    constructor(data) {
        this.id = data.id || '';
        this.creationDate = data.creationDate?.toDate();
    }

    public getId() {
        return this.id;
    };

    public getObject(): object {
        const { id, ...data } = this;
        return data;
    }
}
