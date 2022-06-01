import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Navigation } from '@navigation';
import { ModelObject } from '@model';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root'
})
export class NavigationService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('navs', firebase, currentUserService, actionService);
  }

  get(): Observable<Navigation[]> {
    return new Observable(observer => {
      super.get().subscribe(docs => {
        observer.next(docs.map(doc => new Navigation(doc)).sort(this.sort));
      });
    });
  }

  create = (data: ModelObject): string => super.create(data);
  update = (data: Navigation[]): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
  sort = (a: Navigation, b: Navigation): number => a.order - b.order;
}
