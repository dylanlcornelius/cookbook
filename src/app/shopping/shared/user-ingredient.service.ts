import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
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
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('user-ingredients');
    }
    return this.ref;
  }

  constructor(
    private firestoreService: FirestoreService,
    private currentUserService: CurrentUserService,
    private actionService: ActionService
  ) {}

  getUserIngredients(): Observable<UserIngredient[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => new UserIngredient(doc)));
      });
    });
  }

  getUserIngredient(uid: string): Observable<UserIngredient> {
    return new Observable(observer => {
      this.firestoreService.get(this.getRef(), uid, 'uid').subscribe(docs => {
        if (docs.length > 0) {
          observer.next(new UserIngredient(docs[0]));
        } else {
          const userIngredient = new UserIngredient({uid: uid});
          userIngredient.id = this.postUserIngredient(userIngredient);
          observer.next(userIngredient);
        }
      });
    });
  }

  postUserIngredient(data: UserIngredient) {
    return this.firestoreService.post(this.getRef(), data.getObject());
  }

  putUserIngredient(data: UserIngredient) {
    this.firestoreService.put(this.getRef(), data.getId(), data.getObject());
  }

  putUserIngredients(data: Array<UserIngredient>) {
    this.firestoreService.putAll(this.getRef(), data);
  }

  buyUserIngredient(data: UserIngredient, actions: Number, isCompleted: boolean) {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.getRef().doc(data.getId()).set(data.getObject());
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
      }
    });
  }
}
