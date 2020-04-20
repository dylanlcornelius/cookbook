import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../../admin/shared/config.service';
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
    private zone: NgZone,
    private cookieService: CookieService,
    private userService: UserService,
    private configService: ConfigService,
    private actionService: ActionService,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setCurrentUser(user);
      } else {
        firebase.auth().getRedirectResult().then(result => {
          if (result.credential) {
            this.setCurrentUser(result.user);
            this.actionService.commitAction(result.user.uid, Action.LOGIN, 1);
          } else {
            this.userService.setIsGuest(true);
          }
        }, () => {
          this.userService.setIsGuest(true);
        });
      }
    });
  }

  setCurrentUser(user) {
    this.userService.getUser(user.uid).subscribe(current => {
      this.userService.setCurrentUser(current);
      this.userService.setIsLoggedIn(true);
      this.userService.setIsGuest(false);

      if (this.redirectUrl) {
        this.router.navigate([this.redirectUrl]);
      }
    });
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.cookieService.delete('LoggedIn');
      this.userService.setCurrentUser(new User('', '', '', '', false, false, ''));
      this.userService.setIsLoggedIn(false);
      this.userService.setIsGuest(true);
      this.router.navigate(['/login']);
    }).catch(error => { console.log(error.message); });
  }
}
