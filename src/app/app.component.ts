import { environment } from '../environments/environment';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import '@firebase/firestore';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { fadeComponentAnimation } from 'src/app/theme/animations';
import { User } from './user/shared/user.model';
import { CurrentUserService } from './user/shared/current-user.service';

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
    private currentUserService: CurrentUserService
  ) {
    this.title.setTitle(environment.config.title);
  }

  ngOnInit() {
    this.user = this.currentUserService.getCurrentUser();
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();
    this.isGuest = this.currentUserService.getIsGuest();
  }

  routeTransition(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
