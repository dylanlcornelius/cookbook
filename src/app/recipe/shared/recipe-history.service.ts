import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { RecipeHistories, RecipeHistory } from '@recipeHistory';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeHistoryService extends FirestoreService<RecipeHistory> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super(
      'recipe-histories',
      (data) => new RecipeHistory(data),
      firebase,
      currentUserService,
      actionService
    );
  }

  add(uid: string, recipeId: string): void {
    this.getByUserAndRecipe(uid, recipeId)
      .pipe(take(1))
      .subscribe((recipeHistory) => {
        const today = new Date();
        const lastDateCooked = `${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}`.toString();

        if (!recipeHistory.id) {
          this.create(
            new RecipeHistory({
              uid: uid,
              recipeId: recipeId,
              history: [lastDateCooked],
              timesCooked: 1,
              lastDateCooked: lastDateCooked,
            })
          );
          return;
        }

        recipeHistory.history.push(lastDateCooked);
        recipeHistory.timesCooked++;
        recipeHistory.lastDateCooked = lastDateCooked;
        this.update(recipeHistory);
      });
  }

  set(uid: string, recipeId: string, timesCooked: number, updateDate: boolean): void {
    this.getByUserAndRecipe(uid, recipeId)
      .pipe(take(1))
      .subscribe((recipeHistory) => {
        const today = new Date();
        const lastDateCooked = `${today.getDate()}/${
          today.getMonth() + 1
        }/${today.getFullYear()}`.toString();

        if (!recipeHistory.id) {
          const newRecipeHistory = new RecipeHistory({ uid: uid, recipeId: recipeId, timesCooked });
          if (updateDate) {
            newRecipeHistory.lastDateCooked = lastDateCooked;
          }
          this.create(newRecipeHistory);
        } else {
          const updatedRecipeHistory = new RecipeHistory({ ...recipeHistory, timesCooked });
          if (updateDate) {
            updatedRecipeHistory.lastDateCooked = lastDateCooked;
          }
          this.update(updatedRecipeHistory);
        }
      });
  }

  getByUserAndRecipe(uid: string, recipeId: string): Observable<RecipeHistory> {
    return new Observable((observable) => {
      super
        .getByQuery(
          this.firebase.query(
            this.ref,
            this.firebase.where('uid', '==', uid),
            this.firebase.where('recipeId', '==', recipeId)
          )
        )
        .subscribe((docs) => {
          observable.next(new RecipeHistory(docs[0]));
        });
    });
  }

  getByUser(uid: string): Observable<RecipeHistories> {
    return new Observable((observable) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
        .subscribe((docs) => {
          observable.next(docs.map((doc) => new RecipeHistory(doc)));
        });
    });
  }

  create = (data: RecipeHistory): string => super.create(data.getObject());
  update = (data: RecipeHistory): void => super.update(data.getObject(), data.getId());
}
