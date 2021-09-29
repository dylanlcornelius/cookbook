import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Recipe, RecipeObject, RECIPE_STATUS } from '@recipe';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { Validation } from '@validation';
import { SuccessNotification } from '@notification';
import { NotificationService, ValidationService } from '@modalService';

@Injectable({
  providedIn: 'root'
})
export class RecipeService extends FirestoreService {
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private validationService: ValidationService,
    private notificationService: NotificationService
  ) {
    super('recipes', currentUserService, actionService);
  }

  get(id: string): Observable<Recipe>;
  get(): Observable<Recipe[]>;
  get(id?: string): Observable<Recipe | Recipe[]>; // type for spyOn
  get(id?: string): Observable<Recipe | Recipe[]> {
    return new Observable(observer => {
      if (id) {
        super.get(id).subscribe(doc => {
          observer.next(new Recipe(doc));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new Recipe(doc)));
        });
      }
    });
  }

  create = (data: Recipe): string => super.create(data, Action.CREATE_RECIPE);
  update = (data: RecipeObject | RecipeObject[], id?: string): void => super.update(data, id, Action.UPDATE_RECIPE);
  delete = (id: string): void => super.delete(id, Action.DELETE_RECIPE);

  calculateMeanRating(ratings: { rating: number }[] ): number {
    if (!ratings || ratings.length === 0) {
      return 0;
    }
    
    return ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length / 3 * 100;
  }

  rateRecipe(rating: number, uid: string, recipe: Recipe): void {
    recipe.ratings = recipe.ratings.filter(value => value.uid !== uid);
    if (rating !== 0) {
      recipe.ratings.push({uid: uid, rating: rating});
    }
    recipe.meanRating = this.calculateMeanRating(recipe.ratings);
    
    this.update(recipe.getObject(), recipe.getId());
  }

  changeStatus(recipe: Recipe): void {
    this.validationService.setModal(new Validation(
      `Are you sure you want to change the visibility of this recipe?`,
      this.changeStatusEvent,
      [recipe]
    ));
  }

  changeStatusEvent = (recipe: Recipe): void => {
    if (recipe.status === RECIPE_STATUS.PRIVATE) {
      recipe.status = RECIPE_STATUS.PUBLISHED;
    } else {
      recipe.status = RECIPE_STATUS.PRIVATE;
    }
    this.update(recipe.getObject(), recipe.getId());
    this.notificationService.setModal(new SuccessNotification('Recipe status updated!'));
  };
}
