import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { CurrentUserService } from '@currentUserService';

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
    private currentUserService: CurrentUserService
  ) {
    this.redirect = this.authService.redirectUrl;
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();
  }

  signIn(): void {
    this.authService.googleLogin();
  }
}
