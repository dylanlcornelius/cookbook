import { Component, OnInit, ChangeDetectorRef, ApplicationRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  // TODO: attempt button hightlight per page
  isLoggedIn: Observable<boolean>;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    // TODO: re-enable login (guards/logged-in-guard.guard.ts)
    this.isLoggedIn = new Observable<boolean>(ob => {ob.next(true); });
    // this.isLoggedIn = this.authService.isLoggedIn;
  }

  signOut() {
    this.authService.logout();
  }
}
