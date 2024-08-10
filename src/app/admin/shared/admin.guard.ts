import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  constructor(private currentUserService: CurrentUserService) {}

  canActivate(): Observable<boolean> {
    return this.currentUserService.getCurrentUser().pipe(
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
