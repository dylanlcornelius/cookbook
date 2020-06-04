import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable, observable } from 'rxjs';
import { Action } from '@actions';
import { Recipe } from './recipe.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('recipes');
    }
    return this.ref;
  }

  private filters = [];

  get selectedFilters(): Array<any> { return this.filters; }
  set selectedFilters(filters: Array<any>) { this.filters = filters; }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  getRecipes(): Observable<Recipe[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new Recipe(doc);
        }));
      });
    });
  }

  getRecipe(id: string): Observable<Recipe> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef(), id).subscribe(doc => {
        observable.next(new Recipe(doc));
      })
    });
  }

  postRecipe(data): String {
    return this.firestoreService.post(this.getRef(), data, Action.CREATE_RECIPE);
  }

  putRecipe(id: string, data) {
    this.firestoreService.put(this.getRef(), id, data, Action.UPDATE_RECIPE);
  }

  deleteRecipe(id: string) {
    this.firestoreService.delete(this.getRef(), id, Action.DELETE_RECIPE);
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
    
    this.putRecipe(recipe.getId(), recipe.getObject());
  }
}
