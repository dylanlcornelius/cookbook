import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirestoreService } from '@firestoreService';
import { Household } from '@household';
import { ModelObject } from '@model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HouseholdService extends FirestoreService {
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('households', currentUserService, actionService);
  }

  get(uid: string): Observable<Household> {
    return new Observable(observer => {
      super.getMany(this.ref?.where('memberIds', 'array-contains', uid)).subscribe(docs => {
        observer.next(docs[0] ? new Household(docs[0]) : undefined);
      });
    });
  }

  getInvites(uid: string): Observable<Household[]> {
    return new Observable(observer => {
      super.getMany(this.ref?.where('inviteIds', 'array-contains', uid)).subscribe(docs => {
        observer.next(docs.map(doc => new Household(doc)));
      });
    });
  }

  create = (data: Household): string => super.create(data.getObject());
  update = (data: ModelObject | ModelObject[], id? : string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);
}
