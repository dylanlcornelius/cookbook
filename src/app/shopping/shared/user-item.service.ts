import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem } from './user-item.model';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserItemService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('user-items');
    }
    return this.ref;
  }

  constructor(
    private firestoreService: FirestoreService,
    private currentUserService: CurrentUserService,
    private actionService: ActionService
  ) {}

  getUserItems(): Observable<UserItem[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new UserItem(doc);
        }));
      });
    });
  }

  getUserItem(uid: string): Observable<UserItem> {
    return new Observable((observer) => {
      this.firestoreService.get(this.getRef(), uid, 'uid').subscribe(docs => {
        if (docs.length > 0) {
          observer.next(new UserItem(docs[0]));
        } else {
          const userItem = new UserItem({uid: uid});
          userItem.id = this.postUserItem(userItem);
          observer.next(userItem);
        }
      });
    });
  }

  postUserItem(data: UserItem): string {
    const newDoc = this.getRef().doc();
    newDoc.set(data.getObject());
    return newDoc.id;
  }

  putUserItem(data: UserItem) {
    this.getRef().doc(data.getId()).set(data.getObject());
  }

  putUserItems(data: Array<UserItem>) {
    this.firestoreService.putAll(this.getRef(), data);
  }

  buyUserItem(data: UserItem, actions: Number, isCompleted: boolean) {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.getRef().doc(data.getId()).set(data.getObject());
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
      }
    });
  }
}
