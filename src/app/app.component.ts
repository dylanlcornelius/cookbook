import { environment } from '../environments/environment';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import '@firebase/firestore';
import { Title } from '@angular/platform-browser';
import { fadeComponentAnimation } from 'src/app/util/animations';
import { Observable } from 'rxjs';
import { UserService } from './user/user.service';
import { User } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeComponentAnimation]
})

export class AppComponent implements OnInit {
  user: Observable<User>;
  isLoggedIn: Observable<boolean>;
  isGuest: Observable<boolean>;

  constructor(
    private title: Title,
    private userService: UserService
  ) {
    this.title.setTitle(environment.config.title);
  }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    this.isLoggedIn = this.userService.getIsLoggedIn();
    this.isGuest = this.userService.getIsGuest();
  }

  routeTransition(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
