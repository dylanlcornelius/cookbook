export class Notification {
    type: string;
    icon: string;
    text: string;

    constructor(text: string) {
        this.text = text;
    }
}

export class SuccessNotification extends Notification {
    type = 'success';
    icon = 'check';
}

export class InfoNotification extends Notification {
    type = 'info';
    icon = 'help_outline';
}

export class FailureNotification extends Notification {
    type = 'failure';
    icon = 'priority_high';
}
