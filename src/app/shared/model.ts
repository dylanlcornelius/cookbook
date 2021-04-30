export abstract class Model {
    id: string;

    constructor(data) {
        this.id = data.id || '';
    }

    public getId() {
        return this.id;
    };

    public getObject(): object {
        const { id, ...data } = this;
        return data;
    }
}
