import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('users');
    }
    return this.ref;
  }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  getUsers(): Observable<User[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => new User(doc)));
      });
    });
  }

  getUser(uid: string): Observable<User> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef(), uid, 'uid').subscribe(docs => {
        observable.next(docs[0] ? new User(docs[0]) : undefined);
      });
    });
  }

  postUser(data: User): string {
    return this.firestoreService.post(this.getRef(), data.getObject());
  }

  putUser(data: User) {
    this.firestoreService.put(this.getRef(), data.getId(), data.getObject());
  }

  putUsers(data: Array<User>) {
    this.firestoreService.putAll(this.getRef(), data);
  }

  deleteUser(id: string) {
    this.firestoreService.delete(this.getRef(), id);
  }
}
