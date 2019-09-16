import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserIngredient } from './user-ingredient.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService {

  ref = firebase.firestore().collection('user-ingredients');

  constructor(
    private cookieService: CookieService,
    private actionService: ActionService
  ) { }

  getUserIngredients(uid: string): Observable<UserIngredient> {
    const self = this;
    return new Observable((observer) => {
      this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
          let userIngredient;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userIngredient = new UserIngredient(data.uid, data.ingredients, doc.id);
          });
          observer.next(userIngredient);
        } else {
          self.postUserIngredient(new UserIngredient(uid, [])).subscribe(userIngredient => {
            observer.next(userIngredient);
          });
        }
      });
    });
  }

  postUserIngredient(userIngredient: UserIngredient): Observable<UserIngredient> {
    return new Observable((observer) => {
      this.ref.add(userIngredient).then((doc) => {
        observer.next();
      });
    });
  }

  putUserIngredient(data: UserIngredient) {
    this.ref.doc(data.getId()).set(data.getObject())
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  buyUserIngredient(data: UserIngredient, actions: Number, isCompleted: boolean) {
    const self = this;
    const user = this.cookieService.get('LoggedIn');
    this.ref.doc(data.getId()).set(data.getObject()).then(() => {
      this.actionService.commitAction(user, Action.BUY_INGREDIENT, actions).then(function () {
        if (isCompleted) {
          self.actionService.commitAction(user, Action.COMPLETE_SHOPPING_LIST, 1);
        }
      });
    })
    .catch(function(error) {
      console.error('error: ', error);
    });
  }
}
