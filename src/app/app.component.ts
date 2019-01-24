import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import firestore from 'firebase/firestore';

const config = {
  apiKey: 'AIzaSyAWCAmxLZSlo3Uc5f4aAB6p7ad05b1pit8',
  authDomain: 'cookbook-99016.firebaseapp.com',
  databaseURL: 'https://cookbook-99016.firebaseio.com',
  projectId: 'cookbook-99016',
  storageBucket: 'cookbook-99016.appspot.com',
  messagingSenderId: '687603129153'
};
// need messagingsenderid?

// const config = {
//   apiKey: 'AIzaSyAWCAmxLZSlo3Uc5f4aAB6p7ad05b1pit8',
//   authDomain: '',
//   databaseURL: '',
//   projectId: 'cookbook-99016',
//   storageBucket: ''
// };

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Cookbook';

  ngOnInit() {
    firebase.initializeApp(config);
    // firebase.firestore().settings(settings);
  }
}
