import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard {
  pageLoad: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.currentUserService.getIsLoggedIn().pipe(
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
