import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem } from './user-item.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserItemService {

  ref = firebase.firestore().collection('user-items');

  constructor(
    private cookieService: CookieService,
    private actionService: ActionService
  ) { }

  getUserItems(uid: string): Observable<any> {
    const self = this;
    return new Observable((observer) => {
      this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
        if (querySnapshot.size > 0) {
          let userItem;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            userItem = new UserItem(data.uid, data.items, doc.id);
          });
          observer.next(userItem);
        } else {
          self.postUserItem({uid: uid, items: []}).subscribe(userItem => {
            observer.next(userItem);
          });
        }
      });
    });
  }

  postUserItem(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          id: doc.id,
          uid: data.uid,
          items: data.items,
        });
      });
    });
  }

  putUserItem(data: UserItem) {
    this.ref.doc(data.getId()).set(data.getObject())
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  buyUserItem(data: UserItem, actions: Number, isCompleted: boolean) {
    const self = this;
    const user = this.cookieService.get('LoggedIn');
    this.ref.doc(data.getId()).set(data.getObject()).then(() => {
      this.actionService.commitAction(user, Action.BUY_INGREDIENT, actions).then(function () {
        if (isCompleted) {
          self.actionService.commitAction(user, Action.COMPLETE_SHOPPING_LIST, 1);
        }
      });
    })
    .catch(function(error) {
      console.error('error: ', error);
    });
  }
}
