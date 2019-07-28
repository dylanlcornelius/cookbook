import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '.././user.service';
import { map, take } from 'rxjs/operators';
import { User } from '../user.model';

@Injectable({
  providedIn: 'root'
})
export class UserPendingGuard implements CanActivate {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.userService.getCurrentUser()
      .pipe(
        take(1),
        map((user: User) => {
          if (!user.isPending()) {
            return true;
          }

          this.router.navigate(['/user-pending']);
          return false;
        })
      );
  }
}
