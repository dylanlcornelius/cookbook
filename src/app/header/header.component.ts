import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../animations';
import { User } from '../user/user.model';
import { AuthService } from '../user/auth.service';

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
  showNav = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

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
