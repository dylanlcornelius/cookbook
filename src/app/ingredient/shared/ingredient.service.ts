import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Ingredient } from '@ingredient';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { ActionService } from '@actionService';

@Injectable({
  providedIn: 'root'
})
export class IngredientService extends FirestoreService {
  get ref() {
    return super.getRef('ingredients');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  get(id: string): Observable<Ingredient>;
  get(): Observable<Ingredient[]>;
  get(): Observable<Ingredient | Ingredient[]>; // type for spyOn
  get(id?: string): Observable<Ingredient | Ingredient[]> {
    return new Observable(observer => {
      if (id) {
        super.get(this.ref, id).subscribe(doc => {
          observer.next(new Ingredient(doc));
        })
      } else {
        super.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new Ingredient(doc)).sort(this.sort));
        });
      }
    });
  }

  create = (data): string => super.create(this.ref, data, Action.CREATE_INGREDIENT);
  update = (data, id?: string) => super.update(this.ref, data, id, Action.UPDATE_INGREDIENT);
  delete = (id: string) => super.delete(this.ref, id, Action.DELETE_INGREDIENT);
  sort = (a: Ingredient, b: Ingredient) => a.name.localeCompare(b.name);

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
