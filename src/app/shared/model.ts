export abstract class Model {
    id: string;
    creationDate: Date;

    constructor(data: any) {
        this.id = data.id || '';
        if (data.creationDate && data.creationDate.toDate) {
            this.creationDate = data.creationDate.toDate();
        }
    }

    public getId(): string {
        return this.id;
    }

    public getObject(): ModelObject {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id, ...data } = this;
        return data;
    }
}

export type ModelObject = Omit<Model, 'id'>;
