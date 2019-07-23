import { environment } from '../environments/environment';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import '@firebase/firestore';
import { Title } from '@angular/platform-browser';
import { fadeComponentAnimation } from 'src/app/animations';
import { Observable } from 'rxjs';
import { AuthService } from './user/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeComponentAnimation]
})

export class AppComponent implements OnInit {
  isDarkTheme: Observable<boolean>;

  constructor(
    private title: Title,
    private authService: AuthService
  ) {
    this.title.setTitle(environment.config.title);
  }

  ngOnInit() {
    this.isDarkTheme = this.authService.isDarkTheme;
  }

  routeTransition(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
