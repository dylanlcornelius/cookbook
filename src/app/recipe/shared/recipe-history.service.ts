import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CurrentUserService } from '@currentUserService';
import { RecipeHistory } from '@recipeHistory';

@Injectable({
  providedIn: 'root'
})
export class RecipeHistoryService extends FirestoreService {
  get ref() {
    return super.getRef('recipe-histories');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  add(uid: string, recipeId: string) {
    this.get(uid, recipeId).pipe(take(1)).subscribe(recipeHistory => {
      const today = new Date();
      const lastDateCooked = (today.getDate() + '/' + (today.getMonth() + 1) + '/' + today.getFullYear()).toString();

      if (!recipeHistory.id) {
        this.create(new RecipeHistory({uid: uid, recipeId: recipeId, history: [lastDateCooked], timesCooked: 1, lastDateCooked: lastDateCooked}));
        return;
      }

      recipeHistory.history.push(lastDateCooked);
      recipeHistory.timesCooked++;
      recipeHistory.lastDateCooked = lastDateCooked;
      this.update(recipeHistory);
    });
  }

  set(uid: string, recipeId: string, timesCooked: number) {
    this.get(uid, recipeId).pipe(take(1)).subscribe(recipeHistory => {
      if (!recipeHistory.id) {
        this.create(new RecipeHistory({uid: uid, recipeId: recipeId, timesCooked}));
      } else {
        this.update(new RecipeHistory({ ...recipeHistory, timesCooked }));
      }
    });
  }

  get(uid: string, recipeId: string): Observable<RecipeHistory>;
  get(uid: string): Observable<RecipeHistory[]>;
  get(uid: string): Observable<RecipeHistory | RecipeHistory[]>; // type for spyOn
  get(uid: string, recipeId?: string): Observable<RecipeHistory | RecipeHistory[]> {
    return new Observable(observable => {
      if (recipeId) {
        super.get(this.ref?.where('uid', '==', uid).where('recipeId', '==', recipeId)).subscribe(docs => {
          observable.next(new RecipeHistory(docs[0]));
        });
      } else {
        super.get(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          observable.next(docs.map(doc => new RecipeHistory(doc)));
        });
      }
    });
  }

  create = (data: RecipeHistory): string => super.create(this.ref, data.getObject());
  update = (data: RecipeHistory) => super.update(this.ref, data.getObject(), data.getId());
}
