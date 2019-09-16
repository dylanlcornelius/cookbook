import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { Ingredient } from './ingredient.model';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  ref = firebase.firestore().collection('ingredients');

  constructor(
    private cookieService: CookieService,
    private actionService: ActionService,
  ) { }

  getIngredients(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const ingredients = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ingredients.push({
            id: doc.id,
            name: data.name || '',
            category: data.category || '',
            amount: data.amount,
            uom: data.uom,
            calories: data.calories || '',
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
          id: doc.id,
          name: data.name || '',
          category: data.category || '',
          amount: data.amount,
          uom: data.uom,
          calories: data.calories || '',
        });
      });
    });
  }

  postIngredient(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.CREATE_INGREDIENT, 1);
        observer.next({
          id: doc.id
        });
      });
    });
  }

  putIngredient(id, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.UPDATE_INGREDIENT, 1);
        observer.next();
      });
    });
  }

  deleteIngredients(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.DELETE_INGREDIENT, 1);
        observer.next();
      });
    });
  }
}
