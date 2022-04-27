import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirestoreService } from '@firestoreService';
import { Household } from '@household';
import { Model, ModelObject } from '@model';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { User } from '@user';
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

  get(uid: string): Observable<Household>;
  get(): Observable<Household[]>;
  get(uid?: string): Observable<Household | Household[]>; // type for spyOn
  get(uid?: string): Observable<Household | Household[]> {
    return new Observable(observer => {
      if (uid) {
        super.getMany(this.ref?.where('memberIds', 'array-contains', uid)).subscribe(docs => {
          observer.next(new Household(docs[0] || { id: uid }));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new Household(doc)));
        });
      }
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
  update = (data: ModelObject | Model[], id? : string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);

  hasAuthorPermission(household: Household, user: User, recipe: Recipe): boolean {
    return household.memberIds.includes(recipe.uid) || user.uid === recipe.uid || recipe.status === RECIPE_STATUS.BLUEPRINT;
  }

  hasUserPermission(household: Household, user: User, recipe: Recipe): boolean {
    return (this.hasAuthorPermission(household, user, recipe) || recipe.status === RECIPE_STATUS.PUBLISHED) && recipe.status !== RECIPE_STATUS.BLUEPRINT;
  }
}
