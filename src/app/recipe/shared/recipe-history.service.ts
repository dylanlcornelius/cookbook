import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CurrentUserService } from '@currentUserService';
import { RecipeHistory } from '@recipeHistory';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class RecipeHistoryService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('recipe-histories', firebase, currentUserService, actionService);
  }

  add(uid: string, recipeId: string): void {
    this.get(uid, recipeId)
      .pipe(take(1))
      .subscribe(recipeHistory => {
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

  set(uid: string, recipeId: string, timesCooked: number): void {
    this.get(uid, recipeId)
      .pipe(take(1))
      .subscribe(recipeHistory => {
        if (!recipeHistory.id) {
          this.create(new RecipeHistory({ uid: uid, recipeId: recipeId, timesCooked }));
        } else {
          this.update(new RecipeHistory({ ...recipeHistory, timesCooked }));
        }
      });
  }

  get(uid: string, recipeId: string): Observable<RecipeHistory>;
  get(uid: string): Observable<RecipeHistory[]>;
  get(): Observable<RecipeHistory[]>;
  get(uid?: string): Observable<RecipeHistory | RecipeHistory[]>; // type for spyOn
  get(uid?: string, recipeId?: string): Observable<RecipeHistory | RecipeHistory[]> {
    return new Observable(observable => {
      if (uid && recipeId) {
        super
          .getMany(
            this.firebase.query(
              this.ref,
              this.firebase.where('uid', '==', uid),
              this.firebase.where('recipeId', '==', recipeId)
            )
          )
          .subscribe(docs => {
            observable.next(new RecipeHistory(docs[0]));
          });
      } else if (uid) {
        super
          .getMany(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
          .subscribe(docs => {
            observable.next(docs.map(doc => new RecipeHistory(doc)));
          });
      } else {
        super.get().subscribe(docs => {
          observable.next(docs.map(doc => new RecipeHistory(doc)));
        });
      }
    });
  }

  create = (data: RecipeHistory): string => super.create(data.getObject());
  update = (data: RecipeHistory): void => super.update(data.getObject(), data.getId());
}
