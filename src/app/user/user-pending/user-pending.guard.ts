import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '.././auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserPendingGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isPending
      .pipe(
        take(1),
        map((isPending: boolean) => {
          if (!isPending) {
            return true;
          }
          this.authService.redirectUrl = state.url;

          this.router.navigate(['/user-pending']);
          return false;
        })
      );
  }
}
