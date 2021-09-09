import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from '../../user/shared/auth.service';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
  ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.currentUserService.getCurrentUser()
      .pipe(
        take(1),
        map((user: User) => {
          if (!user.isAdmin) {
            return false;
          }
          return true;
        })
      );
  }

  canActivateChild(): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate();
  }
}
