import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { ActionService } from 'src/app/profile/action.service';
import { Action } from '../profile/action.enum';
import { UserIngredient } from './user-ingredient.modal';
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

  getUserIngredients(uid: string): Observable<any> {
    const self = this;
    return new Observable((observer) => {
      this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
          const userIngredients = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userIngredients.push({
                id: doc.id,
                uid: data.uid,
                ingredients: data.ingredients,
              });
          });
          observer.next(userIngredients[0]);
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
      this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.BUY_INGREDIENT, actions);
      this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.COMPLETE_SHOPPING_LIST, 1);
    })
    .catch(function(error) {
      console.error('error: ', error);
    });
  }
}
