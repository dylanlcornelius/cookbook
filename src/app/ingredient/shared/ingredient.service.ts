import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Ingredient } from './ingredient.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class IngredientService {
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('ingredients');
    }
    return this._ref;
  }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  get(id: string): Observable<Ingredient>;
  get(): Observable<Ingredient[]>;
  get(): Observable<Ingredient | Ingredient[]>; // type for spyOn
  get(id?: string): Observable<Ingredient | Ingredient[]> {
    return new Observable(observer => {
      if (id) {
        this.firestoreService.get(this.ref, id).subscribe(doc => {
          observer.next(new Ingredient(doc));
        })
      } else {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new Ingredient(doc)).sort(this.sort));
        });
      }
    });
  }

  create(data): String {
    return this.firestoreService.create(this.ref, data, Action.CREATE_INGREDIENT);
  }

  update(data, id?: string) {
    if (id) {
      this.firestoreService.update(this.ref, id, data, Action.UPDATE_INGREDIENT);
    } else {
      this.firestoreService.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    this.firestoreService.delete(this.ref, id, Action.DELETE_INGREDIENT);
  }

  sort(a: Ingredient, b: Ingredient) {
    return a.name.localeCompare(b.name);
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
