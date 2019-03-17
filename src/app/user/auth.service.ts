import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../admin/config.service';
import { UserActionService } from '../user/user-action.service';
import { Action } from '../user/action.enum';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;

  private user: firebase.User;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private admin = new BehaviorSubject<boolean>(false);
  private pending = new BehaviorSubject<boolean>(true);


  get User() { return this.user; }
  get isLoggedIn() { return this.loggedIn.asObservable(); }
  get isAdmin() { return this.admin.asObservable(); }
  get isPending() { return this.pending.asObservable(); }

  constructor(
    private router: Router,
    private zone: NgZone,
    private cookieService: CookieService,
    private userService: UserService,
    private configService: ConfigService,
    private userActionService: UserActionService,
    ) {
      const self = this;
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          const loggedInCookie = self.cookieService.get('LoggedIn');
          self.userService.getUser(loggedInCookie).subscribe(current => {
            if (current) {
              self.loggedIn.next(loggedInCookie !== '');
              self.userService.CurrentUser = current;
              self.admin.next(self.userService.isAdmin);
              self.pending.next(self.userService.isPending);
              if (self.redirectUrl) {
                self.router.navigate([self.redirectUrl]);
              }
              self.configService.getConfig('auto-logout').subscribe(autoLogout => {
                self.cookieService.delete('LoggedIn');
                const expirationDate = new Date();
                expirationDate.setMinutes(expirationDate.getMinutes() + Number(autoLogout.value));
                self.cookieService.set('LoggedIn', loggedInCookie, expirationDate);
                setTimeout(() => {
                  self.logout();
                }, Number(autoLogout.value) * 60000);
              });
            }
          });
        }
      });
  }

  googleLogin() {
    const self = this;
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // let token = result.credential.accessToken;
      self.user = result.user;
      self.loggedIn.next(true);
      self.userService.getUser(self.user.uid).subscribe(current => self.login(self, current));
    }).catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.log(errorCode);
      console.log(errorMessage);
      // console.log(email);
    });
  }

  login(self, currentUser) {
      if (currentUser) {
        self.userService.CurrentUser = currentUser;
        self.finishLogin(self, currentUser);
      } else {
        self.userService.postUser({uid: self.user.uid, firstName: '', lastName: '', role: 'pending'})
        .subscribe(current => self.finishLogin(self, current));
      }
  }

  finishLogin(self, currentUser) {
    this.admin.next(this.userService.isAdmin);
    this.pending.next(this.userService.isPending);

    this.configService.getConfig('auto-logout').subscribe(autoLogout => {
      // TODO: check google sign without prompting for account
      const expirationDate = new Date();
      expirationDate.setMinutes(expirationDate.getMinutes() + Number(autoLogout.value));
      self.cookieService.set('LoggedIn', self.user.uid, expirationDate);
      this.userActionService.commitAction(self.user.uid, Action.LOGIN);

      self.zone.run(() => self.router.navigate(['']));

      setTimeout(() => {
        self.logout();
      }, Number(autoLogout.value) * 60000);
    });
  }

  logout() {
    const self = this;
    firebase.auth().signOut().then(function() {
      self.cookieService.delete('LoggedIn');
      self.user = undefined;
      self.userService.CurrentUser = undefined;
      self.loggedIn.next(false);
      self.router.navigate(['/login']);
    }).catch(function(error) {
      console.log(error.message);
    });
  }
}
