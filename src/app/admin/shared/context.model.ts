import { FirestoreService } from '@firestoreService';

export class Context {
  title: string;
  displayedColumns: string[];
  dataSource = [];
  service: FirestoreService;
  revert: Function;
  save: Function;
  remove: Function;
  add: Function;

  constructor(
    title: string,
    displayedColumns: string[],
    service: FirestoreService,
    revert: Function,
    save: Function,
    remove: Function,
    add?: Function
  ) {
    this.title = title;
    this.displayedColumns = ['id', ...displayedColumns, 'creationDate'];
    this.service = service;
    this.revert = (): void => revert(this);
    this.save = (): void => save(this);
    this.remove = (id: string): void => remove(this, id);
    if (add) {
      this.add = (): void => add(this);
    }
  }
}
