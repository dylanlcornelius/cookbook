import { NotificationType } from '@notifications';

export class Notification {
    type: NotificationType;
    text: string;

    constructor(type: NotificationType, text: string) {
        this.type = type;
        this.text = text;
    }
}