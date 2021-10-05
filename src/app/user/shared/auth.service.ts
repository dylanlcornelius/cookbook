import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { ROLE, User } from '@user';
import { CurrentUserService } from '@currentUserService';
import { UserService } from '@userService';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  redirectUrl: string;

  constructor(
    private router: Router,
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private actionService: ActionService,
  ) {
    if (firebase.apps.length > 0) {
      this.load();
    }
  }

  load(): void {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        this.currentUserService.setIsGuest(true);
        return;
      }

      this.userService.get(user.uid).pipe(first()).subscribe(current => {
        if (!current) {
          current = new User({
            uid: user.uid,
            role: ROLE.USER
          });

          current.id = this.userService.create(current);
        }
        
        this.currentUserService.setCurrentUser(current);
        this.currentUserService.setIsLoggedIn(true);
        this.currentUserService.setIsGuest(false);
  
        this.actionService.commitAction(user.uid, Action.LOGIN, 1);
  
        // use replace url to pop empty route from history
        if (this.redirectUrl) {
          this.router.navigate([this.redirectUrl], { replaceUrl: true });
        } else {
          this.router.navigate(['/home'], { replaceUrl: true });
        }
      });
    });
  }

  googleLogin(): void {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  logout(): void {
    firebase.auth().signOut().then(() => {
      this.currentUserService.setCurrentUser(new User({}));
      this.currentUserService.setIsLoggedIn(false);
      this.currentUserService.setIsGuest(true);
      this.redirectUrl = null;
      this.router.navigate(['/login']);
    }).catch(error => { console.log(error.message); });
  }
}
