import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  ref = firebase.firestore().collection('users');

  private currentUser: User;

  get CurrentUser() { return this.currentUser; }
  set CurrentUser(currentUser: User) { this.currentUser = currentUser; }
  get isAdmin() { return this.checkIsAdmin(); }
  get isPending() { return this.checkIsPending(); }

  constructor() {}

  checkIsAdmin() {
    if (this.currentUser) {
      return this.currentUser.role === 'admin';
    } else {
      // return false;
    }
  }

  checkIsPending() {
    if (this.currentUser) {
      return this.currentUser.role === 'pending';
    } else {
      // return true;
    }
  }

  getUsers(): Observable<User[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({
            key: doc.id,
            uid: data.uid,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          });
        });
        observer.next(users);
      });
    });
  }

  getUser(uid: string): Observable<User> {
    return new Observable((observer) => {
      this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
        const users = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({
            key: doc.id,
            uid: data.uid,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          });
        });
        // return only the first user
        observer.next(users[0]);
      });
    });
  }

  // getUser(id: string): Observable<User> {
  //   return new Observable((observer) => {
  //     this.ref.doc(id).get().then((doc) => {
  //       const data = doc.data();
  //       // if (!data) {
  //       //   return;
  //       // }
  //       observer.next({
  //         key: doc.id,
  //         uid: data.uid,
  //         firstName: data.firstName,
  //         lastName: data.lastName,
  //         role: data.role,
  //       });
  //     });
  //   });
  // }

  postUsers(data): Observable<User> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          key: doc.id,
          uid: data.uid,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        });
      });
    });
  }

  putUsers(id: string, data): Observable<User> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  deleteUsers(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}
