import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem } from './user-item.model';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserItemService extends FirestoreService{
  get ref() {
    return super.getRef('user-items');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  get(uid: string): Observable<UserItem>;
  get(): Observable<UserItem[]>;
  get(): Observable<UserItem | UserItem[]>; // type for spyOn
  get(uid?: string): Observable<UserItem | UserItem[]> {
    return new Observable((observer) => {
      if (uid) {
        super.get(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          if (docs.length > 0) {
            observer.next(new UserItem(docs[0]));
          } else {
            const userItem = new UserItem({uid: uid});
            userItem.id = this.create(userItem);
            observer.next(userItem);
          }
        });
      } else {
        super.get(this.ref).subscribe(docs => {
          observer.next(docs.map(doc => {
            return new UserItem(doc);
          }));
        });
      }
    });
  }

  create(data: UserItem): string {
    return super.create(this.ref, data.getObject());
  }

  update(data: UserItem | UserItem[]) {
    if (!Array.isArray(data)) {
      super.update(this.ref, data.getId(), data.getObject());
    } else {
      super.updateAll(this.ref, data);
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
