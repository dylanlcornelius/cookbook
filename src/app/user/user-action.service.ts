import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import { Action } from './action.enum';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  ref = firebase.firestore().collection('user-actions');

  constructor() {}


  commitAction(uid: String, action: Action) {
    // this.ref.where('uid', '==', uid)
  }
}
