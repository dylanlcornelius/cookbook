import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Ingredient, IngredientObject, Ingredients } from '@ingredient';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('ingredients', firebase, currentUserService, actionService);
  }

  get(id: string): Observable<Ingredient>;
  get(): Observable<Ingredients>;
  get(): Observable<Ingredient | Ingredients>; // type for spyOn
  get(id?: string): Observable<Ingredient | Ingredients> {
    return new Observable(observer => {
      if (id) {
        super.get(id).subscribe(doc => {
          observer.next(new Ingredient(doc));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new Ingredient(doc)).sort(this.sort));
        });
      }
    });
  }

  create = (data: IngredientObject): string => super.create(data, Action.CREATE_INGREDIENT);
  update = (data: IngredientObject | Ingredients, id?: string): void =>
    super.update(data, id, Action.UPDATE_INGREDIENT);
  delete = (id: string): void => super.delete(id, Action.DELETE_INGREDIENT);
  sort = (a: Ingredient, b: Ingredient): number => a.name.localeCompare(b.name);
}
