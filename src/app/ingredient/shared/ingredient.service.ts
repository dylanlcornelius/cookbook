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

  getIngredients(): Observable<Ingredient[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const ingredients = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ingredients.push(new Ingredient(
            data.name || '',
            data.category || '',
            data.amount,
            data.uom,
            data.calories || '',
            doc.id,
          ));
        });
        observer.next(ingredients);
      });
    });
  }

  getIngredient(id: string): Observable<Ingredient> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        const data = doc.data();
        observer.next(new Ingredient(
          data.name || '',
          data.category || '',
          data.amount,
          data.uom,
          data.calories || '',
          doc.id,
        ));
      });
    });
  }

  postIngredient(data): Observable<Ingredient> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.CREATE_INGREDIENT, 1);
        observer.next(new Ingredient(
          data.name || '',
          data.category || '',
          data.amount,
          data.uom,
          data.calories || '',
          doc.id,
        ));
      });
    });
  }

  putIngredient(id: string, data): Observable<Ingredient> {
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
