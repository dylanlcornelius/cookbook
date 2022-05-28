import { environment } from '../environments/environment';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { fadeComponentAnimation } from 'src/app/theme/animations';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';

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
    private overlayContainer: OverlayContainer,
    private title: Title,
    private currentUserService: CurrentUserService
  ) {
    this.title.setTitle(environment.title);
  }

  ngOnInit() {
    this.user = this.currentUserService.getCurrentUser();
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();
    this.isGuest = this.currentUserService.getIsGuest();

    this.user.subscribe(user => {
      if (user.uid) {
        if (user.theme) {
          this.overlayContainer.getContainerElement().classList.add('dark');
        } else {
          this.overlayContainer.getContainerElement().classList.remove('dark');
        }
      }
    });
  }
}
