import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem } from '@userItem';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@modalService';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root'
})
export class UserItemService extends FirestoreService{
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super('user-items', firebase, currentUserService, actionService);
  }

  get(uid: string): Observable<UserItem[]>;
  get(): Observable<UserItem[]>;
  get(): Observable<UserItem[]>; // type for spyOn
  get(uid?: string): Observable<UserItem[]> {
    return new Observable((observer) => {
      if (uid) {
        super.getMany(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid))).subscribe(docs => {
          observer.next(docs.map(doc => new UserItem(doc)));
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new UserItem(doc)));
        });
      }
    });
  }

  create = (data: UserItem): string => super.create(data.getObject());
  delete = (id: string): void => super.delete(id);

  buyUserItem(actions: number, isCompleted: boolean): void {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
        this.notificationService.setModal(new SuccessNotification('List completed!'));
      }
    });
  }
}
