import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Recipe } from './recipe.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('recipes');
    }
    return this._ref;
  }

  private filters = [];

  get selectedFilters(): Array<any> { return this.filters; }
  set selectedFilters(filters: Array<any>) { this.filters = filters; }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  get(id: string): Observable<Recipe>;
  get(): Observable<Recipe[]>;
  get(): Observable<Recipe | Recipe[]>; // type for spyOn
  get(id?: string): Observable<Recipe | Recipe[]> {
    return new Observable(observer => {
      if (id) {
        this.firestoreService.get(this.ref, id).subscribe(doc => {
          observer.next(new Recipe(doc));
        })
      } else {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => new Recipe(doc)));
        });
      }
    });
  }

  create(data): string {
    return this.firestoreService.create(this.ref, data, Action.CREATE_RECIPE);
  }

  update(data, id?: string) {
    if (id) {
      this.firestoreService.update(this.ref, id, data, Action.UPDATE_RECIPE);
    } else {
      this.firestoreService.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    this.firestoreService.delete(this.ref, id, Action.DELETE_RECIPE);
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
