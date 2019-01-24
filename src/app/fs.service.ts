import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FsService {

  ref = firebase.firestore().collection('recipes');

  constructor() { }

  getRecipes(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        let recipes = [];
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          recipes.push({
            key: doc.id,
            name: data.name,
            description: data.description,
            time: data.time,
            calories: data.calories,
            servings: data.servings,
            quantity: data.quantity
          });
        });
        observer.next(recipes);
      });
    });
  }

  getRecipe(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        let data = doc.data();
        observer.next({
          key: doc.id,
          name: data.name,
          description: data.description,
          time: data.time,
          calories: data.calories,
          servings: data.servings,
          quantity: data.quantity
        });
      });
    });
  }

  postRecipes(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          key: doc.id
        });
      });
    });
  }

  putRecipes(id: string, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteRecipes(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}
