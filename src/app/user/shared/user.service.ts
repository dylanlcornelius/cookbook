import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User, UserObject, Users } from '@user';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class UserService extends FirestoreService {
  constructor(
    firebase: FirebaseService,
    currentUserService: CurrentUserService,
    actionService: ActionService
  ) {
    super('users', firebase, currentUserService, actionService);
  }

  get(uid: string): Observable<User>;
  get(): Observable<Users>;
  get(uid?: string): Observable<User | Users>; // type of spyOn
  get(uid?: string): Observable<User | Users> {
    return new Observable(observer => {
      if (uid) {
        super
          .getMany(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
          .subscribe(docs => {
            observer.next(docs[0] ? new User(docs[0]) : undefined);
          });
      } else {
        super.get().subscribe(docs => {
          observer.next(docs.map(doc => new User(doc)));
        });
      }
    });
  }

  create = (data: User): string => super.create(data.getObject());
  update = (data: UserObject | Users, id?: string): void => super.update(data, id);
  delete = (id: string): void => super.delete(id);
}
