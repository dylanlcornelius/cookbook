import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserIngredient } from './user-ingredient.model';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService {
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('user-ingredients');
    }
    return this._ref;
  }

  constructor(
    private firestoreService: FirestoreService,
    private currentUserService: CurrentUserService,
    private actionService: ActionService
  ) {}

  get(uid: string): Observable<UserIngredient>;
  get(): Observable<UserIngredient[]>;
  get(): Observable<UserIngredient | UserIngredient[]>; // type for spyOn
  get(uid?: string): Observable<UserIngredient | UserIngredient[]> {
    return new Observable(observer => {
      if (uid) {
        this.firestoreService.get(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          if (docs.length > 0) {
            observer.next(new UserIngredient(docs[0]));
          } else {
            const userIngredient = new UserIngredient({uid: uid});
            userIngredient.id = this.create(userIngredient);
            observer.next(userIngredient);
          }
        });
      } else {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new UserIngredient(doc)));
        });
      }
    });
  }

  create(data: UserIngredient): string {
    return this.firestoreService.create(this.ref, data.getObject());
  }

  update(data: UserIngredient | UserIngredient[]) {
    if (!Array.isArray(data)) {
      this.firestoreService.update(this.ref, data.getId(), data.getObject());
    } else {
      this.firestoreService.updateAll(this.ref, data);
    }
  }

  buyUserIngredient(data: UserIngredient, actions: Number, isCompleted: boolean) {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.update(data);
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
      }
    });
  }
}
