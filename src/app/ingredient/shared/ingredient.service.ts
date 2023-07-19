import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Ingredient, IngredientObject } from '@ingredient';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { Recipe } from '@recipe';
import { NumberService } from '@numberService';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private numberService: NumberService
  ) {
    super('ingredients', firebase, currentUserService, actionService);
  }

  get(id: string): Observable<Ingredient>;
  get(): Observable<Ingredient[]>;
  get(): Observable<Ingredient | Ingredient[]>; // type for spyOn
  get(id?: string): Observable<Ingredient | Ingredient[]> {
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
  update = (data: IngredientObject | Ingredient[], id?: string): void =>
    super.update(data, id, Action.UPDATE_INGREDIENT);
  delete = (id: string): void => super.delete(id, Action.DELETE_INGREDIENT);
  sort = (a: Ingredient, b: Ingredient): number => a.name.localeCompare(b.name);

  buildRecipeIngredients(
    recipeIngredients: Ingredient[],
    allIngredients: (Ingredient | Recipe)[]
  ): Ingredient[] {
    return recipeIngredients.reduce((result, addedIngredient) => {
      const currentIngredient = allIngredients.find(
        ingredient => ingredient.id === addedIngredient.id
      );
      if (currentIngredient) {
        result.push({
          id: currentIngredient.id,
          amount: currentIngredient.amount,
          name: currentIngredient.name,
          uom: addedIngredient.uom || '',
          quantity: this.numberService.toFormattedFraction(addedIngredient.quantity),
          isOptional: addedIngredient.isOptional || false,
        });
      }
      return result;
    }, []);
  }
}
