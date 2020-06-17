import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user.model';
import { CurrentUserService } from '../shared/current-user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-user-pending',
  templateUrl: './user-pending.component.html',
  styleUrls: ['./user-pending.component.scss']
})
export class UserPendingComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  user: Observable<User>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.user = this.currentUserService.getCurrentUser();
    this.user.pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      if (!user.isPending()) {
        this.router.navigate(['/home']);
      }
    });
  }

  signOut() {
    this.authService.logout();
  }
}
