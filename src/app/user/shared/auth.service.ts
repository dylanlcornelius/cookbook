import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { ActionService } from '@actionService';
import { Action } from '@actions';
import { ROLE, User } from '@user';
import { CurrentUserService } from '@currentUserService';
import { UserService } from '@userService';
import { first } from 'rxjs/operators';
import { getApps } from 'firebase/app';

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
    if (getApps().length > 0) {
      this.load();
    }
  }

  load(): void {
    getAuth().onAuthStateChanged(this.handleUserChange);
  }

  handleUserChange = (user: any): void => {
    if (!user) {
      this.currentUserService.setIsGuest(true);
      return;
    }

    this.userService.get(user.uid).pipe(first()).subscribe(current => {
      let isNewUser = false;

      if (!current) {
        current = new User({
          uid: user.uid,
          role: ROLE.USER
        });

        current.id = this.userService.create(current);
        isNewUser = true;
      }
      
      this.currentUserService.setCurrentUser(current);
      this.currentUserService.setIsLoggedIn(true);
      this.currentUserService.setIsGuest(false);

      this.actionService.commitAction(user.uid, Action.LOGIN, 1);

      // use replace url to pop empty route from history
      if (isNewUser) {
        this.router.navigate(['/new-user'], { replaceUrl: true });
      } else if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl], { replaceUrl: true });
      } else {
        this.router.navigate(['/home'], { replaceUrl: true });
      }
    });
  };

  googleLogin(): void {
    signInWithRedirect(getAuth(), new GoogleAuthProvider());
  }

  logout(): void {
    getAuth().signOut().then(() => {
      this.currentUserService.setCurrentUser(new User({}));
      this.currentUserService.setIsLoggedIn(false);
      this.currentUserService.setIsGuest(true);
      this.redirectUrl = null;
      this.router.navigate(['/login']);
    }).catch(error => {
      console.log(error.message);
    });
  }
}
