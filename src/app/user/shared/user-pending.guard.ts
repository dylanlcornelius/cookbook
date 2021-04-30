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

import { User } from '@user';
import { CurrentUserService } from './current-user.service';

@Injectable({
  providedIn: 'root'
})
export class UserPendingGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUserService.getCurrentUser()
      .pipe(
        take(1),
        map((user: User) => {
          if (!user.isPending) {
            return true;
          }

          this.router.navigate(['/user-pending']);
          return false;
        })
      );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(route, state);
  }
}
