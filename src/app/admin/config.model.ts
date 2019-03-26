export class Config {
    id: string;
    name: string;
    value: string;

    constructor(id: string, name: string, value: string) {
        this.id = id;
        this.name = name;
        this.value = value;
    }

    public getId() {
        return this.id;
    }

    public getObject() {
        return {
            name: this.name,
            value: this.value,
        };
    }
}
