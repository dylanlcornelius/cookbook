import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { MealPlan, MealPlans } from './meal-plan.model';

@Injectable({
  providedIn: 'root',
})
export class MealPlanService extends FirestoreService<MealPlan> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('meal-plans', (data) => new MealPlan(data), firebase, currentUserService, actionService);
  }

  getByUser(uid: string): Observable<MealPlan> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
        .subscribe((docs) => {
          if (docs.length > 0) {
            observer.next(new MealPlan(docs[0]));
          } else {
            const mealPlan = new MealPlan({ uid: uid });
            mealPlan.id = this.create(mealPlan);
            observer.next(mealPlan);
          }
        });
    });
  }

  create = (data: MealPlan): string => super.create(data.getObject());
  update = (data: ReturnType<MealPlan['getObject']> | MealPlans, id?: string): void =>
    super.update(data, id);

  formattedUpdate(data: MealPlan['recipes'], uid: string, id: string): void {
    const recipes = data.map(({ id }) => ({ id }));
    const mealPlan = new MealPlan({ uid, recipes, id });
    this.update(mealPlan.getObject(), mealPlan.getId());
  }
}
