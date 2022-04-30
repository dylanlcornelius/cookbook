import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { UserItem } from '@userItem';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { Model, ModelObject } from '@model';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@modalService';

@Injectable({
  providedIn: 'root'
})
export class UserItemService extends FirestoreService{
  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
    private notificationService: NotificationService
  ) {
    super('user-items', currentUserService, actionService);
  }

  get(uid: string): Observable<UserItem>;
  get(): Observable<UserItem[]>;
  get(): Observable<UserItem | UserItem[]>; // type for spyOn
  get(uid?: string): Observable<UserItem | UserItem[]> {
    return new Observable((observer) => {
      if (uid) {
        super.getMany(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          if (docs.length > 0) {
            observer.next(new UserItem(docs[0]));
          } else {
            const userItem = new UserItem({uid: uid});
            userItem.id = this.create(userItem);
            observer.next(userItem);
          }
        });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new UserItem(doc)));
        });
      }
    });
  }

  create = (data: UserItem): string => super.create(data.getObject());
  update = (data: ModelObject | Model[], id?: string): void => super.update(data, id);

  formattedUpdate(data: UserItem["items"], uid: string, id: string): void {
    const items = data.map(({ name = '' }) => ({ name }));
    const userIngredient = new UserItem({ uid, items, id });
    this.update(userIngredient.getObject(), userIngredient.getId());
  }

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
