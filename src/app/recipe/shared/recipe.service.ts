import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Recipe } from './recipe.model';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { ActionService } from '@actionService';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService {
  get ref() {
    return super.getRef('recipes');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  get(id: string): Observable<Recipe>;
  get(): Observable<Recipe[]>;
  get(): Observable<Recipe | Recipe[]>; // type for spyOn
  get(id?: string): Observable<Recipe | Recipe[]> {
    return new Observable(observer => {
      if (id) {
        super.get(this.ref, id).subscribe(doc => {
          observer.next(new Recipe(doc));
        })
      } else {
        super.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new Recipe(doc)));
        });
      }
    });
  }

  create(data): string {
    return super.create(this.ref, data, Action.CREATE_RECIPE);
  }

  update(data, id?: string) {
    if (id) {
      super.update(this.ref, id, data, Action.UPDATE_RECIPE);
    } else {
      super.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    super.delete(this.ref, id, Action.DELETE_RECIPE);
  }

  calculateMeanRating(ratings) {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    
    return ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length / 3 * 100;
  }

  rateRecipe(rating: number, uid: string, recipe: Recipe) {
    recipe.ratings = recipe.ratings.filter(value => value.uid !== uid)
    if (rating !== 0) {
      recipe.ratings.push({uid: uid, rating: rating});
    }
    recipe.meanRating = this.calculateMeanRating(recipe.ratings);
    
    this.update(recipe.getObject(), recipe.getId());
  }
}
