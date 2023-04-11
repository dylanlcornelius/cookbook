import { Model } from '@model';

export class Config extends Model {
    name: string;
    value: string;
    displayValue: string;
    order: number;

    constructor(data: any) {
        super(data);
        this.name = data.name || '';
        this.value = data.value || '';
        this.displayValue = data.displayValue || '';
        this.order = data.order || 0;
    }
}
