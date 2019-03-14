import { Component, OnInit } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { environment } from '../environments/environment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  constructor(private title: Title) {
    firebase.initializeApp(environment.config);
    this.title.setTitle(environment.config.title);
  }
}
