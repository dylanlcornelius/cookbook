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

  getAllUserItems(): Observable<UserItem[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new UserItem(doc);
        }));
      });
    });
  }

  getUserItems(uid: string): Observable<UserItem> {
    const self = this;
    return new Observable((observer) => {
      self.getRef()?.where('uid', '==', uid).onSnapshot(querySnapshot => {
        self.getUserItem(querySnapshot, observer, uid, self);
      });
    });
  }

  getUserItem(querySnapshot, observer, uid, self) {
    if (querySnapshot.size > 0) {
      let userItem;
      querySnapshot.forEach(doc => {
        const data = doc.data();
        userItem = new UserItem({
          uid: data.uid,
          items: data.items,
          id: doc.id
        });
      });
      observer.next(userItem);
    } else {
      const userItem = new UserItem({uid: uid});
      userItem.id = self.postUserItem(userItem);
      observer.next(userItem);
    }
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
