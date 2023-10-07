import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { fadeComponentAnimation } from 'src/app/theme/animations';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeComponentAnimation],
})
export class AppComponent implements OnInit {
  user: Observable<User>;
  isLoggedIn: Observable<boolean>;
  isGuest: Observable<boolean>;

  constructor(private currentUserService: CurrentUserService) {}

  ngOnInit() {
    this.user = this.currentUserService.getCurrentUser();
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();
    this.isGuest = this.currentUserService.getIsGuest();

    this.user.subscribe(user => {
      if (user.uid) {
        if (user.theme) {
          document.body.classList.add('dark');
          document.body.classList.remove('light');
        } else {
          document.body.classList.add('light');
          document.body.classList.remove('dark');
        }
      }
    });
  }
}
