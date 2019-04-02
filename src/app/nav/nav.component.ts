import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  title: string;
  isLoggedIn: Observable<boolean>;
  isAdmin: Observable<boolean>;
  isPending: Observable<boolean>;

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.title = environment.config.title;
    this.isLoggedIn = this.authService.isLoggedIn;
    this.isAdmin = this.authService.isAdmin;
    this.isPending = this.authService.isPending;
  }

  signOut() {
    this.authService.logout();
  }
}
