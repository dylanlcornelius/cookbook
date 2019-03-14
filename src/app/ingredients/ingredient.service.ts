import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { UserActionService } from '../user/user-action.service';
import { Action } from '../user/action.enum';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  ref = firebase.firestore().collection('ingredients');

  constructor(
    private cookieService: CookieService,
    private userActionService: UserActionService,
  ) { }

  getIngredients(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const ingredients = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ingredients.push({
            key: doc.id,
            name: data.name,
            category: data.category,
            amount: data.amount,
            calories: data.calories,
            quantity: data.quantity,
          });
        });
        observer.next(ingredients);
      });
    });
  }

  getIngredient(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        const data = doc.data();
        observer.next({
          key: doc.id,
          name: data.name,
          category: data.category,
          amount: data.amount,
          calories: data.calories,
          quantity: data.quantity,
        });
      });
    });
  }

  postIndegredient(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.CREATE_INGREDIENT);
        observer.next({
          key: doc.id
        });
      });
    });
  }

  putIngredients(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.UPDATE_INGREDIENT);
        observer.next();
      });
    });
  }

  deleteIngredients(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        this.userActionService.commitAction(this.cookieService.get('LoggedIn'), Action.DELETE_INGREDIENT);
        observer.next();
      });
    });
  }
}
