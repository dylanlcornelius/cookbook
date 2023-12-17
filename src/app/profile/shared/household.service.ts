import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirestoreService } from '@firestoreService';
import { Household, Households } from '@household';
import { Models, ModelObject } from '@model';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { User } from '@user';
import { Observable } from 'rxjs';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('households', firebase, currentUserService, actionService);
  }

  get(uid: string): Observable<Household>;
  get(): Observable<Households>;
  get(uid?: string): Observable<Household | Households>; // type for spyOn
  get(uid?: string): Observable<Household | Households> {
    return new Observable(observer => {
      if (uid) {
        super
          .getMany(
            this.firebase.query(this.ref, this.firebase.where('memberIds', 'array-contains', uid))
          )
          .subscribe(docs => {
            observer.next(new Household(docs[0] || { id: uid }));
          });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new Household(doc)));
        });
      }
    });
  }

  getInvites(uid: string): Observable<Households> {
    return new Observable(observer => {
      super
        .getMany(
          this.firebase.query(this.ref, this.firebase.where('inviteIds', 'array-contains', uid))
        )
        .subscribe(docs => {
          observer.next(docs.map(doc => new Household(doc)));
        });
    });
  }

  create = (data: Household): string => super.create(data.getObject());
  update = (data: ModelObject | Models, id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);

  hasAuthorPermission(household: Household, user: User, recipe: Recipe): boolean {
    return (
      household.memberIds.includes(recipe.uid) ||
      user.uid === recipe.uid ||
      recipe.status === RECIPE_STATUS.BLUEPRINT ||
      user.hasAdminView
    );
  }

  hasUserPermission(household: Household, user: User, recipe: Recipe): boolean {
    return (
      (this.hasAuthorPermission(household, user, recipe) ||
        recipe.status === RECIPE_STATUS.PUBLISHED) &&
      recipe.status !== RECIPE_STATUS.BLUEPRINT
    );
  }
}
