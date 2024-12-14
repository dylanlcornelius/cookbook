import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { map, Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Navigation, Navigations } from '@navigation';
import { ModelObject } from '@model';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class NavigationService extends FirestoreService<Navigation> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('navs', (data) => new Navigation(data), firebase, currentUserService, actionService);
  }

  getAll = (): Observable<Navigations> =>
    super.getAll().pipe(map((navigations) => navigations.sort(this.sort)));
  create = (data: ModelObject): string => super.create(data);
  update = (data: Navigations): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
  sort = (a: Navigation, b: Navigation): number => a.order - b.order;
}
