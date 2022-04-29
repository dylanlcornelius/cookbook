import { Modal } from "@modalService";
import { Model } from "@model";

export class Tutorial extends Model {
    text: string;
    baseUrl: string;
    url: string;
    order: number;
    element: string;
    position: POSITION;

    constructor(data: any) {
        super(data);
        this.text = data.text || '';
        this.baseUrl = data.baseUrl || null;
        this.url = data.url || '';
        this.order = data.order || -1;
        this.element = data.element || '';
        this.position = data.position || POSITION.RIGHT;
    }
}

export enum POSITION {
    RIGHT = 'right',
    LEFT = 'left'
}

export class TutorialModal extends Modal {
    originalUrl: string;
    startingUrl?: string;

    constructor(originalUrl: string, startingUrl?: string) {
        super();
        this.originalUrl = originalUrl;
        this.startingUrl = startingUrl;
    }
}