import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Navigation } from '@navigation';

@Injectable({
  providedIn: 'root'
})
export class NavigationService extends FirestoreService {
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('navs', currentUserService, actionService);
  }

  get(): Observable<Navigation[]> {
    return new Observable(observer => {
      super.get().subscribe(docs => {
        observer.next(docs.map(doc => new Navigation(doc)).sort(this.sort));
      });
    });
  }

  create = (data: Navigation): string => super.create(data);
  update = (data: Navigation[]): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
  sort = (a: Navigation, b: Navigation): number => a.order - b.order;
}
