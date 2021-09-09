import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { User } from '@user';
import { CurrentUserService } from '@currentUserService';

@Injectable({
  providedIn: 'root'
})
export class UserPendingGuard implements CanActivate, CanActivateChild {
  constructor(
    private router: Router,
    private currentUserService: CurrentUserService
  ) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUserService.getCurrentUser()
      .pipe(
        take(1),
        map((user: User) => {
          if (!user.isPending) {
            return true;
          }

          this.router.navigate(['/user-pending'], { skipLocationChange: true });
          return false;
        })
      );
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}
