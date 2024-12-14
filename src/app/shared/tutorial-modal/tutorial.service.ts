import { Action } from '@actions';
import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { TutorialModalService } from '@modalService';
import { ModelObject } from '@model';
import { Tutorial, TutorialModal, Tutorials } from '@tutorial';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TutorialService extends FirestoreService<Tutorial> {
  constructor(
    private router: Router,
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private tutorialModalService: TutorialModalService
  ) {
    super('tutorials', (data) => new Tutorial(data), firebase, currentUserService, actionService);
  }

  getAll = (): Observable<Tutorials> =>
    super.getAll().pipe(map((tutorials) => tutorials.sort(this.sort)));
  create = (data: ModelObject): string => super.create(data);
  update = (data: ReturnType<Tutorial['getObject']> | Tutorials, id?: string): void =>
    super.update(data, id);
  delete = (id: string): void => super.delete(id);
  sort = (a: Tutorial, b: Tutorial): number => a.order - b.order;

  openTutorial(startingUrl: boolean): void {
    this.commitAction(Action.OPEN_TUTORIAL);
    this.firebase.logEvent('tutorial_begin');

    this.tutorialModalService.setModal(
      new TutorialModal(
        startingUrl ? this.router.url : '/home',
        startingUrl ? this.router.url : undefined
      )
    );
  }
}
