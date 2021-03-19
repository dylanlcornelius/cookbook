export abstract class Model {
    id: string;

    public getId() {
        return this.id;
    }
    abstract getObject(): Object;
}
