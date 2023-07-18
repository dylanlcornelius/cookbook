import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { FirestoreService } from '@firestoreService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { ModelObject } from '@model';
import { FirebaseService } from '@firebaseService';
import { Feedback } from '@feedback';
import { Action } from '@actions';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('feedbacks', firebase, currentUserService, actionService);
  }

  get(): Observable<Feedback[]> {
    return new Observable(observer => {
      super.get().subscribe(docs => {
        observer.next(docs.map(doc => new Feedback(doc)));
      });
    });
  }

  create = (data: ModelObject): string => super.create(data, Action.SUBMIT_FEEDBACK);
  update = (data: Feedback[]): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
}
