import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../user/shared/current-user.service';
import { Navigation } from '@navigation';

@Injectable({
  providedIn: 'root'
})
export class NavigationService extends FirestoreService {
  get ref() {
    return super.getRef('navs');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super(currentUserService, actionService);
  }

  get(): Observable<Navigation[]> {
    return new Observable(observer => {
      super.get(this.ref).subscribe(docs => {
        observer.next(docs.map(doc => new Navigation(doc)).sort(this.sort));
      })
    });
  }

  create = (data: Navigation): string => super.create(this.ref, data);
  update = (data: Navigation[]) => super.updateAll(this.ref, data);
  delete = (id: string) => super.delete(this.ref, id);
  sort = (a, b) => a.order - b.order;
}
