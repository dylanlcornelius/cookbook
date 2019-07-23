import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth.service';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';
import { User } from '../user.model';
import { Router } from '@angular/router';

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
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
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
