import { Action } from '@actions';
import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { Feedback, Feedbacks } from '@feedback';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { ModelObject } from '@model';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService extends FirestoreService<Feedback> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('feedbacks', (data) => new Feedback(data), firebase, currentUserService, actionService);
  }

  create = (data: ModelObject): string => super.create(data, Action.SUBMIT_FEEDBACK);
  update = (data: Feedbacks): void => super.updateAll(data);
  delete = (id: string): void => super.delete(id);
}
