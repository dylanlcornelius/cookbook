import { Modal } from "../modal.service";

export class Validation extends Modal {
    function: Function;
    id?: string;
    text: string;
    self;

    constructor(eventFunction: Function, id: string, text: string, self) {
        super();
        this.function = eventFunction;
        this.id = id;
        this.text = text;
        this.self = self;
    }
}
