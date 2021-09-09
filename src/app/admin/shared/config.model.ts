import { Model } from '@model';

export class Config extends Model {
    name: string;
    value: string;

    constructor(data: any) {
        super(data);
        this.name = data.name || '';
        this.value = data.value || '';
    }
}
