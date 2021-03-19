import { Model } from '@model';

export class Config extends Model {
    name: string;
    value: string;

    constructor(data) {
        super();
        this.id = data.id || '';
        this.name = data.name || '';
        this.value = data.value || '';
    }

    public getObject() {
        const {id, ...config} = this;
        return config;
    }
}
