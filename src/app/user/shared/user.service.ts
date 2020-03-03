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

  private currentUser = new BehaviorSubject<User>(new User('', '', '', '', false, false, ''));
  private isloggedIn = new BehaviorSubject<boolean>(false);
  private isGuest = new BehaviorSubject<boolean>(false);

  getCurrentUser(): Observable<User> { return this.currentUser.asObservable(); }
  setCurrentUser(currentUser: User) { this.currentUser.next(currentUser); }

  getIsLoggedIn() { return this.isloggedIn.asObservable(); }
  setIsLoggedIn(isloggedIn: boolean) { this.isloggedIn.next(isloggedIn); }

  getIsGuest() { return this.isGuest.asObservable(); }
  setIsGuest(isGuest: boolean) { this.isGuest.next(isGuest); }

  constructor() {}

  getUsers(): Observable<User[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push(new User(
            data.uid || '',
            data.firstName || '',
            data.lastName || '',
            data.role || '',
            data.theme || false,
            data.simplifiedView || false,
            doc.id
          ));
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
          users.push(new User(
            data.uid || '',
            data.firstName || '',
            data.lastName || '',
            data.role || '',
            data.theme || false,
            data.simplifiedView || false,
            doc.id
          ));
        });
        // return only the first user
        observer.next(users[0]);
      });
    });
  }

  postUser(data: User): Observable<User> {
    return new Observable((observer) => {
      this.ref.add(data.getObject()).then((doc) => {
        observer.next(new User(
          data.uid || '',
          data.firstName || '',
          data.lastName || '',
          data.role || '',
          data.theme || false,
          data.simplifiedView || false,
          doc.id
        ));
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
