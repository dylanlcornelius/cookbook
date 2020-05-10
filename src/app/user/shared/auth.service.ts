import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { UserService } from './user.service';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;

  constructor(
    private router: Router,
    private userService: UserService,
    private actionService: ActionService,
  ) {
    if (firebase.apps.length > 0) {
      this.load();
    }
  }

  load() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.userService.setIsGuest(true);
        return;
      }

      this.userService.getUser(user.uid).then(current => {
        if (!current) {
            current = new User({
            uid: user.uid,
            role: 'pending'
          });

          current.id = this.userService.postUser(current);
        }
        
        this.userService.setCurrentUser(current);
        this.userService.setIsLoggedIn(true);
        this.userService.setIsGuest(false);
  
        this.actionService.commitAction(user.uid, Action.LOGIN, 1);
  
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl]);
        } else {
          this.router.navigate(['/home']);
        }
      });
    });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.userService.setCurrentUser(new User({}));
      this.userService.setIsLoggedIn(false);
      this.userService.setIsGuest(true);
      this.redirectUrl = null;
      this.router.navigate(['/login']);
    }).catch(error => { console.log(error.message); });
  }
}
