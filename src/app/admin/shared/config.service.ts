import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { Config, Configs } from '@config';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { ModelObject } from '@model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends FirestoreService<Config> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('configs', (data) => new Config(data), firebase, currentUserService, actionService);
  }

  getByName(name: string): Observable<Configs> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('name', '==', name)))
        .subscribe((docs) => {
          observer.next(docs.map((doc) => new Config(doc)).sort(this.sortByOrder));
        });
    });
  }

  getAll = (): Observable<Configs> =>
    super.getAll().pipe(map((configs) => configs.sort(this.sortByOrder).sort(this.sortByName)));
  create = (data: ModelObject): string => super.create(data);
  update = (data: Configs): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
  sortByOrder = (a: Config, b: Config): number => a.order - b.order;
  sortByName = (a: Config, b: Config): number => a.name.localeCompare(b.name);
}
