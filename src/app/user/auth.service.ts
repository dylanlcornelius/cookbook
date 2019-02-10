import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
// import { AngularFireAuth } from '@angular/fire/auth';
import firestore from 'firebase/firestore';
import * as firebase from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user: firebase.User;
  private loggedIn = new BehaviorSubject<boolean>(false);


  get getUser() { return this.user; }
  get isLoggedIn() { return this.loggedIn.asObservable(); }

  constructor(private router: Router, private zone: NgZone) {
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     console.log('here');
    //     this.user = user;
    //     // this.ref.detectChanges();
    //     // this.ar.tick();
    //     // this.zone.run(() => {
    //     // });
    //     console.log(this.signedIn);
    //   } else {
    //     console.log('not signed in');
    //   }
    // });
  }

  googleLogin() {
    const self = this;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // let token = result.credential.accessToken;
      self.user = result.user;
      self.loggedIn.next(true);
      console.log(self.user.email);
      self.zone.run(() => self.router.navigate(['']));
    }).catch(function(error) {
      const errorCode = error.code;
      const erroMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.log(email);
    });
  }

  logout() {
    const self = this;
    firebase.auth().signOut().then(function() {
      console.log('signed out');
      self.user = undefined;
      self.loggedIn.next(false);
      self.router.navigate(['/login']);
    }).catch(function(error) {
      console.log(error.message);
    });
  }
}
