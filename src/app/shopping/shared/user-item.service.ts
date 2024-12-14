import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem, UserItems } from '@userItem';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@modalService';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class UserItemService extends FirestoreService<UserItem> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super('user-items', (data) => new UserItem(data), firebase, currentUserService, actionService);
  }

  getByUser(uid: string): Observable<UserItems> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
        .subscribe((docs) => {
          observer.next(docs.map((doc) => new UserItem(doc)));
        });
    });
  }

  create = (data: UserItem): string => super.create(data.getObject());
  delete = (id: string): void => super.delete(id);

  buyUserItem(actions: number, isCompleted: boolean): void {
    this.currentUserService.getCurrentUser().subscribe((user) => {
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
        this.notificationService.setModal(new SuccessNotification('List completed!'));
      }
    });
  }
}
