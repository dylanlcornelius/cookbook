import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Action } from '@actions';
import { Ingredient } from './ingredient.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  ref = firebase.firestore().collection('ingredients');

  constructor(
    private firestoreService: FirestoreService
  ) {}

  getIngredients(): Promise<Ingredient[]> {
    return new Promise(resolve => {
      this.firestoreService.get(this.ref).then(docs => {
        resolve(docs.map(doc => {
          return new Ingredient(doc);
        }));
      });
    });
  }

  getIngredient(id: string): Promise<Ingredient> {
    return new Promise(resolve => {
      this.firestoreService.get(this.ref, id).then(doc => {
        resolve(new Ingredient(doc));
      })
    });
  }

  postIngredient(data): String {
    return this.firestoreService.post(this.ref, data, Action.CREATE_INGREDIENT);
  }

  putIngredient(id: string, data) {
    this.firestoreService.put(this.ref, id, data, Action.UPDATE_INGREDIENT);
  }

  deleteIngredients(id: string) {
    this.firestoreService.delete(this.ref, id, Action.DELETE_INGREDIENT);
  }
}
