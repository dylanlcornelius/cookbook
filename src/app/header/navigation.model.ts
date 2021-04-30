import { Model } from '@model';

export class Navigation extends Model {
    name: string;
    link: string;
    icon: string;
    order: Number;
    subMenu: NavigationMenu;
    isNavOnly: boolean;

    constructor (data) {
        super(data);
        this.name = data.name || '';
        this.link = data.link || '/';
        this.icon = data.icon || '';
        this.order = data.order || 0;
        this.subMenu = data.subMenu || '';
        this.isNavOnly = data.isNavOnly || false;
    }
}

export enum NavigationMenu {
    PROFILE = 'profile',
    TOOLS = 'tools'
}
