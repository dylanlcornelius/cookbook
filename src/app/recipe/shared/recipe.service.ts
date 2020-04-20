import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { Recipe } from './recipe.model';
import { UserService } from '@userService';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  ref = firebase.firestore().collection('recipes');

  private filters = [];

  get selectedFilters(): Array<String> { return this.filters; }
  set selectedFilters(filters: Array<String>) { this.filters = filters; }

  constructor(
    private userService: UserService,
    private actionService: ActionService,
  ) { }

  getRecipes(): Observable<Recipe[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const recipes = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          recipes.push(new Recipe(
            data.name || '',
            data.description || '',
            data.time || '',
            data.calories || '',
            data.servings || '',
            data.quantity || '',
            data.categories || [],
            data.steps || [],
            data.ingredients || [],
            data.uid || '',
            data.author || '',
            doc.id,
          ));
        });
        observer.next(recipes);
      });
    });
  }

  getRecipe(id: string): Observable<Recipe> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        const data = doc.data();
        observer.next(new Recipe(
          data.name || '',
          data.description || '',
          data.time || '',
          data.calories || '',
          data.servings || '',
          data.quantity || '',
          data.categories || [],
          data.steps || [],
          data.ingredients || [],
          data.uid || '',
          data.author || '',
          doc.id,
        ));
      });
    });
  }

  postRecipe(data): Observable<Recipe> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        this.userService.getCurrentUser().subscribe(user => {
          this.actionService.commitAction(user.uid, Action.CREATE_RECIPE, 1);
        });
        observer.next(new Recipe(
          data.name || '',
          data.description || '',
          data.time || '',
          data.calories || '',
          data.servings || '',
          data.quantity || '',
          data.categories || [],
          data.steps || [],
          data.ingredients || [],
          data.uid || '',
          data.author || '',
          doc.id,
        ));
      });
    });
  }

  putRecipes(id: string, data): Observable<Recipe> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        this.userService.getCurrentUser().subscribe(user => {
          this.actionService.commitAction(user.uid, Action.UPDATE_RECIPE, 1);
        });
        observer.next();
      });
    });
  }

  deleteRecipes(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        this.userService.getCurrentUser().subscribe(user => {
          this.actionService.commitAction(user.uid, Action.DELETE_RECIPE, 1);
        });
        observer.next();
      });
    });
  }
}
