import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserIngredient } from './user-ingredient.model';
import { Observable } from 'rxjs';
import { UserService } from '@userService';
import { FirestoreService } from '@firestoreService';

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
    private userService: UserService,
    private actionService: ActionService
  ) {}

  getUserIngredients(): Observable<UserIngredient[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new UserIngredient(doc);
        }));
      });
    });
  }

  getUserIngredient(uid: string): Observable<UserIngredient> {
    const self = this;
    return new Observable((observer) => {
      this.getRef()?.where('uid', '==', uid).get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
          let userIngredient;
          querySnapshot.forEach((doc) => {
            userIngredient = new UserIngredient({
              ...doc.data(),
              id: doc.id
            });
          });
          observer.next(userIngredient);
        } else {
          const userIngredient = new UserIngredient({uid: uid, ingredients: []});
          userIngredient.id = self.postUserIngredient(userIngredient);
          observer.next(userIngredient);
        }
      });
    });
  }

  postUserIngredient(data: UserIngredient) {
    const newDoc = this.getRef().doc();
    newDoc.set(data.getObject());
    return newDoc.id;
  }

  putUserIngredient(data: UserIngredient) {
    this.getRef().doc(data.getId()).set(data.getObject())
    .catch(function(error) { console.error('error: ', error); });
  }

  putUserIngredients(data: Array<UserIngredient>) {
    this.firestoreService.putAll(this.getRef(), data);
  }

  buyUserIngredient(data: UserIngredient, actions: Number, isCompleted: boolean) {
    this.userService.getCurrentUser().subscribe(user => {
      this.getRef().doc(data.getId()).set(data.getObject());
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
      }
    });
  }
}
