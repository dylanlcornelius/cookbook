import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../shared/auth.service';
import { CurrentUserService } from '@currentUserService';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanActivateChild {
  pageLoad;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.currentUserService.getIsLoggedIn()
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

          this.router.navigate(['/login'], { skipLocationChange: true });
          return false;
        })
      );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
