import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Ingredient } from './ingredient.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('ingredients');
    }
    return this.ref;
  }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  getIngredients(): Observable<Ingredient[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new Ingredient(doc);
        }));
      });
    });
  }

  getIngredient(id: string): Promise<Ingredient> {
    return new Promise(resolve => {
      this.firestoreService.get(this.getRef(), id).subscribe(doc => {
        resolve(new Ingredient(doc));
      })
    });
  }

  postIngredient(data): String {
    return this.firestoreService.post(this.getRef(), data, Action.CREATE_INGREDIENT);
  }

  putIngredient(id: string, data) {
    this.firestoreService.put(this.getRef(), id, data, Action.UPDATE_INGREDIENT);
  }

  deleteIngredient(id: string) {
    this.firestoreService.delete(this.getRef(), id, Action.DELETE_INGREDIENT);
  }

  buildRecipeIngredients(recipeIngredients, allIngredients) {
    return recipeIngredients.reduce((result, addedIngredient) => {
      const currentIngredient = allIngredients.find(ingredient => ingredient.id === addedIngredient.id);
      if (currentIngredient) {
        result.push({
          id: currentIngredient.id,
          name: currentIngredient.name,
          uom: addedIngredient.uom || '',
          quantity: addedIngredient.quantity || '',
        });
      }
      return result;
    }, []);
  }
}
