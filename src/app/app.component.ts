import { Component, ViewEncapsulation } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';
import { fadeComponentAnimation } from 'src/app/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  animations: [fadeComponentAnimation]
})

export class AppComponent {
  constructor(private title: Title) {
    firebase.initializeApp(environment.config);
    this.title.setTitle(environment.config.title);
  }

  routeTransition(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
