import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class IngredientsService {

  ref = firebase.firestore().collection('ingredients');

  constructor() { }

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
          calories: data.calories,
          quantity: data.quantity,
        });
      });
    });
  }

  postIndegredients(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          key: doc.id
        });
      });
    });
  }

  putIngredients(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteIngredients(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}
