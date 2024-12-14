import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { Household, Households } from '@household';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { User } from '@user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HouseholdService extends FirestoreService<Household> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('households', (data) => new Household(data), firebase, currentUserService, actionService);
  }

  getByUser(uid: string): Observable<Household> {
    return new Observable((observer) => {
      super
        .getByQuery(
          this.firebase.query(this.ref, this.firebase.where('memberIds', 'array-contains', uid))
        )
        .subscribe((docs) => {
          observer.next(new Household(docs[0] || { id: uid }));
        });
    });
  }

  getInvites(uid: string): Observable<Households> {
    return new Observable((observer) => {
      super
        .getByQuery(
          this.firebase.query(this.ref, this.firebase.where('inviteIds', 'array-contains', uid))
        )
        .subscribe((docs) => {
          observer.next(docs.map((doc) => new Household(doc)));
        });
    });
  }

  create = (data: Household): string => super.create(data.getObject());
  update = (data: ReturnType<Household['getObject']> | Households, id?: string): void =>
    super.update(data, id);
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
