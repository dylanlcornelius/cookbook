import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  isLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isPending: Observable<boolean>;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.isAdmin = this.authService.isAdmin;
    this.isPending = this.authService.isPending;
  }

  signOut() {
    this.authService.logout();
  }
}
