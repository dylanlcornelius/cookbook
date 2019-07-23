import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { firebase } from '@firebase/app';
import '@firebase/auth';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../admin/config.service';
import { ActionService } from 'src/app/profile/action.service';
import { Action } from '../profile/action.enum';
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
    const loggedInCookie = this.cookieService.get('LoggedIn');
    if (loggedInCookie) {
      // TODO: use firebase auth token, as cookie can last longer than auth session
      this.userService.getUser(loggedInCookie).subscribe(current => {
        if (current) {
          this.userService.setCurrentUser(current);
          this.userService.setIsLoggedIn(true);

          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          }
          this.configService.getConfig('auto-logout').subscribe(autoLogout => {
            this.cookieService.delete('LoggedIn');
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + Number(autoLogout.value));
            this.cookieService.set('LoggedIn', loggedInCookie, expirationDate);
            setTimeout(() => {
              this.logout();
            }, Number(autoLogout.value) * 60000);
          });
        }
      });
    } else {
      this.userService.setIsGuest(true);
    }
  }

  googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      // let token = result.credential.accessToken;
      if (result && result.user && result.user.uid) {
        const uid = result.user.uid;

        this.userService.getUser(result.user.uid).subscribe(currentUser => {
          if (currentUser) {
            this.finishLogin(currentUser, uid);
          } else {
            this.userService.postUser(new User(uid, '', '', 'pending', false)).subscribe(current => this.finishLogin(current, uid));
          }
        });
      }
    }).catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.log(errorCode);
      console.log(errorMessage);
      // console.log(email);
    });
  }

  finishLogin(currentUser, uid) {
    this.userService.setCurrentUser(currentUser);
    this.userService.setIsLoggedIn(true);
    this.userService.setIsGuest(false);

    this.configService.getConfig('auto-logout').subscribe(autoLogout => {
      // TODO: check google signing in without prompting for account
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + Number(autoLogout.value));
      this.cookieService.set('LoggedIn', uid, expirationDate);
      this.actionService.commitAction(uid, Action.LOGIN, 1);

      // TODO: research zone.run()
      this.zone.run(() => this.router.navigate(['/home']));

      setTimeout(() => {
        this.logout();
      }, Number(autoLogout.value) * 60000);
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.cookieService.delete('LoggedIn');
      this.userService.setCurrentUser(new User('', '', '', '', false, ''));
      this.userService.setIsLoggedIn(false);
      this.userService.setIsGuest(true);
      this.router.navigate(['/login']);
    }).catch(error => {
      console.log(error.message);
    });
  }
}
