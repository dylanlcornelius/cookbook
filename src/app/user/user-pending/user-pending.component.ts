import { Component, OnInit } from '@angular/core';
import { AuthService } from '.././auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-pending',
  templateUrl: './user-pending.component.html',
  styleUrls: ['./user-pending.component.scss']
})
export class UserPendingComponent implements OnInit {

  isPending: Observable<boolean>;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.isPending = this.authService.isPending;
  }

  signOut() {
    this.authService.logout();
  }
}
