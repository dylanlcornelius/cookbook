import { Component } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  redirect: string;
  isLoggedIn: boolean;

  constructor(
    private authService: AuthService,
    private cookieService: CookieService
  ) {
    this.redirect = this.authService.redirectUrl;
    this.isLoggedIn = this.cookieService.get('LoggedIn') ? true : false;
  }

  signIn() {
    this.authService.googleLogin();
  }
}
