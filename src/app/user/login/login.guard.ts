import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs/operators';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  private pageLoad;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.getIsLoggedIn()
      .pipe(
        take(1),
        map((isLoggedIn: boolean) => {
          if (isLoggedIn) {
            return true;
          }

          if (!this.pageLoad) {
            this.authService.redirectUrl = state.url;
            this.pageLoad = state.url;
          }

          this.router.navigate(['/login']);
          return false;
        })
      );
  }
}
