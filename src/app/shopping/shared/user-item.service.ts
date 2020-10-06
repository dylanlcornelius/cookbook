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
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('user-items');
    }
    return this._ref;
  }

  constructor(
    private firestoreService: FirestoreService,
    private currentUserService: CurrentUserService,
    private actionService: ActionService
  ) {}

  get(uid: string): Observable<UserItem>;
  get(): Observable<UserItem[]>;
  get(): Observable<UserItem | UserItem[]>; // type for spyOn
  get(uid?: string): Observable<UserItem | UserItem[]> {
    if (uid) {
      return new Observable((observer) => {
        this.firestoreService.get(this.ref, uid, 'uid').subscribe(docs => {
          if (docs.length > 0) {
            observer.next(new UserItem(docs[0]));
          } else {
            const userItem = new UserItem({uid: uid});
            userItem.id = this.create(userItem);
            observer.next(userItem);
          }
        });
      });
    } else {
      return new Observable(observable => {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observable.next(docs.map(doc => {
            return new UserItem(doc);
          }));
        });
      });
    }
  }

  create(data: UserItem): string {
    return this.firestoreService.create(this.ref, data);
  }

  update(data: UserItem | UserItem[]) {
    if (!Array.isArray(data)) {
      this.firestoreService.update(this.ref, data.getId(), data.getObject());
    } else {
      this.firestoreService.updateAll(this.ref, data);
    }
  }

  buyUserItem(data: UserItem, actions: Number, isCompleted: boolean) {
    this.currentUserService.getCurrentUser().subscribe(user => {
      this.update(data);
      this.actionService.commitAction(user.uid, Action.BUY_INGREDIENT, actions);
      if (isCompleted) {
        this.actionService.commitAction(user.uid, Action.COMPLETE_SHOPPING_LIST, 1);
      }
    });
  }
}
