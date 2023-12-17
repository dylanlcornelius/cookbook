import { Model } from '@model';

export class Navigation extends Model {
  name: string;
  link: string;
  icon: string;
  order: number;
  subMenu: NavigationMenu;
  isNavOnly: boolean;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.link = data.link || '/';
    this.icon = data.icon || '';
    this.order = data.order || 0;
    this.subMenu = data.subMenu || '';
    this.isNavOnly = data.isNavOnly || false;
  }
}

export type Navigations = Navigation[];

export enum NavigationMenu {
  PROFILE = 'profile',
  TOOLS = 'tools',
}
