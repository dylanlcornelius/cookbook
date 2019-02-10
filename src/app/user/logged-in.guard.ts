import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.isLoggedIn
        .pipe(
          take(1),
          map((isLoggedIn: boolean) => {
            if (!isLoggedIn) {
              // TODO: re-enable login (nav/nav.component.ts)
              return true;
              // this.router.navigate(['/login']);
              // return false;
            }
            return true;
          })
        );
  }
}
