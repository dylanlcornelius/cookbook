import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserIngredient } from '@userIngredient';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { Model } from '@model';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@modalService';
import { FirebaseService } from '@firebaseService';
import { Ingredient } from '@ingredient';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super('user-ingredients', firebase, currentUserService, actionService);
  }

  get(uid: string): Observable<UserIngredient[]>;
  get(): Observable<UserIngredient[]>;
  get(): Observable<UserIngredient[]>; // type for spyOn
  get(uid?: string): Observable<UserIngredient[]> {
    return new Observable(observer => {
      if (uid) {
        super.getMany(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid))).subscribe(docs => {
          observer.next(docs.map(doc => new UserIngredient(doc)));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new UserIngredient(doc)));
        });
      }
    });
  }

  create = (data: UserIngredient): string => super.create(data.getObject());
  update = (data: Model[]): void => super.update(data);

  buildUserIngredients(userIngredients: UserIngredient[], ingredients: Ingredient[]): UserIngredient[] {
    return userIngredients.reduce((result, userIngredient) => {
      const currentIngredient = ingredients.find(ingredient => ingredient.id === userIngredient.ingredientId);
      if (currentIngredient) {
        result.push(new UserIngredient({
          ...userIngredient,
          amount: currentIngredient.amount,
          uom: currentIngredient.uom || '',
        }));
      }
      return result;
    }, []);
  }

  buyUserIngredient(actions: number, isCompleted: boolean): void {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
        this.notificationService.setModal(new SuccessNotification('List completed!'));
      }
    });
  }
}
