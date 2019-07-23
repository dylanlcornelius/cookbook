import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../user/auth.service';
import { map, take } from 'rxjs/operators';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.userService.getCurrentUser()
        .pipe(
          take(1),
          map((user: User) => {
            if (!user.isAdmin()) {
              return false;
            }
            return true;
          })
        );
  }
}
