import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserIngredient } from '@userIngredient';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { Model, ModelObject } from '@model';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@modalService';
import { query, where } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService extends FirestoreService {
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super('user-ingredients', currentUserService, actionService);
  }

  get(uid: string): Observable<UserIngredient>;
  get(): Observable<UserIngredient[]>;
  get(): Observable<UserIngredient | UserIngredient[]>; // type for spyOn
  get(uid?: string): Observable<UserIngredient | UserIngredient[]> {
    return new Observable(observer => {
      if (uid) {
        super.getMany(query(this.ref, where('uid', '==', uid))).subscribe(docs => {
          if (docs.length > 0) {
            observer.next(new UserIngredient(docs[0]));
          } else {
            const userIngredient = new UserIngredient({uid: uid});
            userIngredient.id = this.create(userIngredient);
            observer.next(userIngredient);
          }
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new UserIngredient(doc)));
        });
      }
    });
  }

  create = (data: UserIngredient): string => super.create(data.getObject());
  update = (data: ModelObject | Model[], id?: string): void => super.update(data, id);

  formattedUpdate(data: UserIngredient["ingredients"], uid: string, id: string): void {
    const ingredients = data.map(({ id, pantryQuantity, cartQuantity }) => ({ id, pantryQuantity, cartQuantity }));
    const userIngredient = new UserIngredient({ uid, ingredients, id });
    this.update(userIngredient.getObject(), userIngredient.getId());
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
