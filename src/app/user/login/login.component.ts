import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { UserService } from '@userService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  redirect: string;
  isLoggedIn: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.redirect = this.authService.redirectUrl;
    this.isLoggedIn = this.userService.getIsLoggedIn();
  }

  signIn() {
    this.authService.googleLogin();
  }
}
