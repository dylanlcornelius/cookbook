import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { User, UserObject, Users } from '@user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService extends FirestoreService<User> {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('users', (data): User => new User(data), firebase, currentUserService, actionService);
  }

  getByUser(uid: string): Observable<User | undefined> {
    return new Observable((observer) => {
      super
        .getByQuery(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
        .subscribe((docs) => {
          observer.next(docs[0] ? new User(docs[0]) : undefined);
        });
    });
  }

  create = (data: User): string => super.create(data.getObject());
  update = (data: UserObject | Users, id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);
}
