import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserService } from '@userService';
import { AuthService } from '../user/shared/auth.service';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../theme/animations';
import { User } from '../user/shared/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeInAnimation, fadeInFastAnimation, slideInOutAnimation]
})
export class HeaderComponent implements OnInit {

  title: string;
  user: Observable<User>;
  isLoggedIn: Observable<boolean>;
  route: string;
  showNav = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        this.route = event.url;
      }

      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.title = environment.config.title;
    this.user = this.userService.getCurrentUser();
    this.isLoggedIn = this.userService.getIsLoggedIn();
  }

  toggleNav() {
    this.showNav = !this.showNav;
  }

  signOut() {
    this.authService.logout();
  }
}
