import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { UserActionService } from '../user/user-action.service';
import { Action } from '../user/action.enum';
import { UserIngredient } from './user-ingredient.modal';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserIngredientService {

  ref = firebase.firestore().collection('user-ingredients');

  constructor(
    private cookieService: CookieService,
    private userActionService: UserActionService
  ) { }

  getUserIngredients(uid: string): Observable<any> {
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
          self.postUserIngredient({uid: uid, ingredients: []}).subscribe(userIngredient => {
            observer.next(userIngredient);
          });
        }
      });
    });
  }

  postUserIngredient(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
          uid: data.uid,
          ingredients: data.ingredients,
        });
      });
    });
  }

  putUserIngredient(data: UserIngredient) {
    this.ref.doc(data.getId()).set(data.getObject())
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  buyUserIngredient(data: UserIngredient, actions: Number) {
    this.ref.doc(data.getId()).set(data.getObject()).then(() => {
      this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.BUY_INGREDIENT, actions);
    })
    .catch(function(error) {
      console.error('error: ', error);
    });
    this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.COMPLETE_SHOPPING_LIST, 1);
  }
}
