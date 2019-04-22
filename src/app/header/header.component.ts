import { Component, OnInit } from '@angular/core';
import { AuthService } from '../user/auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { fadeInAnimation } from '../animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [fadeInAnimation]
})
export class HeaderComponent implements OnInit {

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
