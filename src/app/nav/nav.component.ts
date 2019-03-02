import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  // TODO: attempt button hightlight per page
  isLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;

  constructor(
    private authService: AuthService,
    // private userService: UserService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn;
    this.isAdmin = this.authService.isAdmin;
  }

  signOut() {
    this.authService.logout();
  }
}
