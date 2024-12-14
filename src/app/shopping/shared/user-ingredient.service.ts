import { ActionService } from '@actionService';
import { Action } from '@actions';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { Ingredients } from '@ingredient';
import { NotificationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UserIngredient, UserIngredients } from '@userIngredient';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserIngredientService extends FirestoreService<UserIngredient> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super(
      'user-ingredients',
      (data) => new UserIngredient(data),
      firebase,
      currentUserService,
      actionService
    );
  }

  getByUser(uid: string): Observable<UserIngredients> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
        .subscribe((docs) => {
          observer.next(docs.map((doc) => new UserIngredient(doc)));
        });
    });
  }

  create = (data: UserIngredient): string => super.create(data.getObject());
  update = (data: UserIngredients): void => super.update(data);
  delete = (id: string): void => super.delete(id);

  buildUserIngredients(
    userIngredients: UserIngredients,
    ingredients: Ingredients
  ): UserIngredients {
    return userIngredients.reduce((result, userIngredient) => {
      const currentIngredient = ingredients.find(
        (ingredient) => ingredient.id === userIngredient.ingredientId
      );
      if (currentIngredient) {
        result.push(
          new UserIngredient({
            ...userIngredient,
            amount: currentIngredient.amount,
            uom: currentIngredient.uom || '',
          })
        );
      }
      return result;
    }, [] as UserIngredients);
  }

  buyUserIngredient(actions: number, isCompleted: boolean): void {
    this.currentUserService.getCurrentUser().subscribe((user) => {
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
        this.notificationService.setModal(new SuccessNotification('List completed!'));
      }
    });
  }
}
