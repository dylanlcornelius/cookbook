import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { Models, ModelObject } from '@model';
import { MealPlan, MealPlans } from './meal-plan.model';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class MealPlanService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('meal-plans', firebase, currentUserService, actionService);
  }

  get(uid: string): Observable<MealPlan>;
  get(): Observable<MealPlans>;
  get(): Observable<MealPlan | MealPlans>; // type for spyOn
  get(uid?: string): Observable<MealPlan | MealPlans> {
    return new Observable(observer => {
      if (uid) {
        super
          .getMany(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
          .subscribe(docs => {
            if (docs.length > 0) {
              observer.next(new MealPlan(docs[0]));
            } else {
              const mealPlan = new MealPlan({ uid: uid });
              mealPlan.id = this.create(mealPlan);
              observer.next(mealPlan);
            }
          });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new MealPlan(doc)));
        });
      }
    });
  }

  create = (data: MealPlan): string => super.create(data.getObject());
  update = (data: ModelObject | Models, id?: string): void => super.update(data, id);

  formattedUpdate(data: MealPlan['recipes'], uid: string, id: string): void {
    const recipes = data.map(({ id }) => ({ id }));
    const mealPlan = new MealPlan({ uid, recipes, id });
    this.update(mealPlan.getObject(), mealPlan.getId());
  }
}
