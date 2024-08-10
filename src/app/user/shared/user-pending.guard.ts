import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserPendingGuard {
  constructor(private router: Router, private currentUserService: CurrentUserService) {}

  canActivate(): Observable<boolean> {
    return this.currentUserService.getCurrentUser().pipe(
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

  canActivateChild(): Observable<boolean> {
    return this.canActivate();
  }
}
