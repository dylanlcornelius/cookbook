import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
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
  get isDarkTheme() { return this.checkIsDarkTheme(); }

  constructor() {}

  checkIsAdmin() {
    if (this.currentUser) {
      return this.currentUser.role === 'admin';
    }
  }

  checkIsPending() {
    if (this.currentUser) {
      return this.currentUser.role === 'pending';
    }
  }

  checkIsDarkTheme() {
    if (this.currentUser) {
      console.log(this.currentUser.theme);
      return this.currentUser.theme;
    }
  }

  getUsers(): Observable<User[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push(new User(data.uid || '', data.firstName || '', data.lastName || '', data.role || '', data.theme || false, doc.id));
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
          users.push(new User(data.uid || '', data.firstName || '', data.lastName || '', data.role || '', data.theme || false, doc.id));
        });
        // return only the first user
        observer.next(users[0]);
      });
    });
  }

  postUser(data: User): Observable<User> {
    return new Observable((observer) => {
      this.ref.add(data.getObject()).then((doc) => {
        observer.next(new User(data.uid || '', data.firstName || '', data.lastName || '', data.role || '', data.theme || false, doc.id));
      });
    });
  }

  putUser(data: User): Observable<User> {
    return new Observable((observer) => {
      this.ref.doc(data.getId()).set(data.getObject()).then(() => {
        observer.next();
      });
    });
  }

  putUsers(data: Array<User>) {
    data.forEach(d => {
      this.ref.doc(d.getId()).set(d.getObject());
    });
  }

  deleteUser(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}
