import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import firestore from 'firebase/firestore';
import * as firebase from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';
import { ConfigService } from '../admin/config.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;

  private user: firebase.User;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private admin = new BehaviorSubject<boolean>(false);
  private pending = new BehaviorSubject<boolean>(true);


  get getUser() { return this.user; }
  get isLoggedIn() { return this.loggedIn.asObservable(); }
  get isAdmin() { return this.admin.asObservable(); }
  get isPending() { return this.pending.asObservable(); }

  constructor(
    private router: Router,
    private zone: NgZone,
    private cookieService: CookieService,
    private userService: UserService,
    private configService: ConfigService
    ) {
      this.loggedIn.next(this.cookieService.get('LoggedIn') !== '');
      this.userService.getUser(this.cookieService.get('LoggedIn')).subscribe(current => {
        if (current) {
          this.userService.CurrentUser = current;
          this.admin.next(this.userService.isAdmin);
          this.pending.next(this.userService.isPending);
          if (this.redirectUrl) {
            this.router.navigate([this.redirectUrl]);
          }
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
        self.userService.postUsers({uid: self.user.uid, firstName: '', lastName: '', role: 'pending'})
        .subscribe(current => self.finishLogin(self, current));
      }
  }

  finishLogin(self, currentUser) {
    this.admin.next(this.userService.isAdmin);
    this.pending.next(this.userService.isPending);

    const expirationDate = new Date();
    this.configService.getConfig('auto-logout').subscribe(autoLogout => {
      // TODO: check if minutes overflow hour
      // TODO: check google sign without prompting for account
      expirationDate.setMinutes(expirationDate.getMinutes() + Number(autoLogout.value));
      self.cookieService.set('LoggedIn', self.user.uid, expirationDate);

      self.zone.run(() => self.router.navigate(['']));
    });
  }

  logout() {
    const self = this;
    firebase.auth().signOut().then(function() {
      // TODO: get rid of loggedin cookie
      self.user = undefined;
      self.userService.CurrentUser = undefined;
      self.loggedIn.next(false);
      self.router.navigate(['/login']);
    }).catch(function(error) {
      console.log(error.message);
    });
  }
}
