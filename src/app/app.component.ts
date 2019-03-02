import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  // TODO: this needed anymore?
  title = 'Cookbook';

  constructor() {
    firebase.initializeApp(environment.config);
  }

  ngOnInit() {
    // firebase.firestore().settings(settings);
  }
}
