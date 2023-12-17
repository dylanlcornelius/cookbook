import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config, Configs } from '@config';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { ModelObject } from '@model';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('configs', firebase, currentUserService, actionService);
  }

  get(name: string): Observable<Configs>;
  get(): Observable<Configs>;
  get(name?: string): Observable<Configs> {
    return new Observable(observer => {
      if (name) {
        super
          .getMany(this.firebase.query(this.ref, this.firebase.where('name', '==', name)))
          .subscribe(docs => {
            observer.next(docs.map(doc => new Config(doc)).sort(this.sortByOrder));
          });
      } else {
        super.get().subscribe(docs => {
          observer.next(
            docs
              .map(doc => new Config(doc))
              .sort(this.sortByOrder)
              .sort(this.sortByName)
          );
        });
      }
    });
  }

  create = (data: ModelObject): string => super.create(data);
  update = (data: Configs): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
  sortByOrder = (a: Config, b: Config): number => a.order - b.order;
  sortByName = (a: Config, b: Config): number => a.name.localeCompare(b.name);
}
