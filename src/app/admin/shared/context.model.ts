import { FirestoreService } from '@firestoreService';
import { Models } from '@model';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';

export class Context {
  title: string;
  displayedColumns: string[];
  dataSource: Models = [];
  service: FirestoreService;
  revert: () => void;
  save: () => void;
  remove: (id: string) => void;
  add?: () => void;

  constructor(
    title: string,
    displayedColumns: string[],
    service: FirestoreService,
    revert: AdminDashboardComponent['revert'],
    save: AdminDashboardComponent['save'],
    remove: AdminDashboardComponent['remove'],
    add?: AdminDashboardComponent['add']
  ) {
    this.title = title;
    this.displayedColumns = ['id', ...displayedColumns, 'creationDate'];
    this.service = service;
    this.revert = (): void => revert();
    this.save = (): void => save(this);
    this.remove = (id: string): void => remove(this, id);
    if (add) {
      this.add = (): void => add(this);
    }
  }
}
