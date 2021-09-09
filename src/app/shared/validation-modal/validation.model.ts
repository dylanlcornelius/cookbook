import { Modal } from "../modal.service";

export class Validation extends Modal {
    function: Function;
    id?: string;
    text: string;

    constructor(eventFunction: Function, id: string, text: string) {
        super();
        this.function = eventFunction;
        this.id = id;
        this.text = text;
    }
}
