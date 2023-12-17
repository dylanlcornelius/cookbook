import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirestoreService } from '@firestoreService';
import { Models, ModelObject } from '@model';
import { Observable } from 'rxjs';
import { Tutorial, TutorialModal, Tutorials } from '@tutorial';
import { TutorialModalService } from '@modalService';
import { Router } from '@angular/router';
import { Action } from '@actions';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class TutorialService extends FirestoreService {
  constructor(
    private router: Router,
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private tutorialModalService: TutorialModalService
  ) {
    super('tutorials', firebase, currentUserService, actionService);
  }

  get(): Observable<Tutorials> {
    return new Observable(observer => {
      super.get().subscribe(docs => {
        observer.next(docs.map(doc => new Tutorial(doc)).sort(this.sort));
      });
    });
  }

  create = (data: ModelObject): string => super.create(data);
  update = (data: ModelObject | Models, id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);
  sort = (a: Tutorial, b: Tutorial): number => a.order - b.order;

  openTutorial(startingUrl: boolean): void {
    this.commitAction(Action.OPEN_TUTORIAL);
    this.firebase.logEvent('tutorial_begin');

    this.tutorialModalService.setModal(
      new TutorialModal(
        startingUrl ? this.router.url : '/home',
        startingUrl ? this.router.url : null
      )
    );
  }
}
