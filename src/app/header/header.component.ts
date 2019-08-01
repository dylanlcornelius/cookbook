import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../animations';
import { User } from '../user/user.model';
import { AuthService } from '../user/auth.service';
import { Router, RouterEvent } from '@angular/router';

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
