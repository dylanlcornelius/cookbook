import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user.model';
import { CurrentUserService } from '../shared/current-user.service';

@Component({
  selector: 'app-user-pending',
  templateUrl: './user-pending.component.html',
  styleUrls: ['./user-pending.component.scss']
})
export class UserPendingComponent implements OnInit {
  user: Observable<User>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
  ) {}

  ngOnInit() {
    this.user = this.currentUserService.getCurrentUser();
    this.user.subscribe(user => {
      if (!user.isPending()) {
        this.router.navigate(['/home']);
      }
    });
  }

  signOut() {
    this.authService.logout();
  }
}
