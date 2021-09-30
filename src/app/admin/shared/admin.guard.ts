import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { User } from '@user';
import { CurrentUserService } from '@currentUserService';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate, CanActivateChild {
  constructor(
    private currentUserService: CurrentUserService,
  ) { }

  canActivate(): Observable<boolean> {
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

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
