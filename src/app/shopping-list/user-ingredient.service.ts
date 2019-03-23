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

  getUserIngredients(uid: string): Observable<UserIngredient> {
    return new Observable((observer) => {
        this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
        const userIngredients = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          userIngredients.push({
              key: doc.id,
              uid: data.uid,
              ingredients: data.ingredients,
            });
        });
        observer.next(userIngredients[0]);
      });
    });
  }

  putUserIngredient(data) {
    this.ref.doc(data.key).set(data)
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  buyUserIngredient(data) {
    this.ref.doc(data.key).set(data).then(() => {
      this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.BUY_INGREDIENT);
    })
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  buyUserIngredients(data) {
    data.forEach(d => {
      this.ref.doc(d.key).set(d).then(() => {
        this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.BUY_INGREDIENT);
      })
      .catch(function(error) {
        console.error('error: ', error);
      });
    });
  }
}
