import { Action } from '@actions';
import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { Ingredient, IngredientObject, Ingredients } from '@ingredient';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends FirestoreService<Ingredient> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super(
      'ingredients',
      (data) => new Ingredient(data),
      firebase,
      currentUserService,
      actionService
    );
  }

  getAll = (): Observable<Ingredients> =>
    super.getAll().pipe(map((ingredients) => ingredients.sort(this.sort)));
  create = (data: IngredientObject): string => super.create(data, Action.CREATE_INGREDIENT);
  update = (data: IngredientObject | Ingredients, id?: string): void =>
    super.update(data, id, Action.UPDATE_INGREDIENT);
  delete = (id: string): void => super.delete(id, Action.DELETE_INGREDIENT);
  sort = (a: Ingredient, b: Ingredient): number => a.name.localeCompare(b.name);
}
