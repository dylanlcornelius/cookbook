import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { CollectionReference } from '@firebase/firestore-types';
import { Action } from '@actions';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  _ref;
  get ref(): CollectionReference {
    if (!this._ref && firebase.apps.length > 0) {
      this._ref = firebase.firestore().collection('user-actions');
    }
    return this._ref;
  }

  constructor() {}

  commitAction(uid: string, action: Action, number: number): void {
    if (!uid) {
      return;
    }

    this.get(uid).then(userAction => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (`${weekStart.getDate()}/${weekStart.getMonth() + 1}/${weekStart.getFullYear()}`).toString();

      if (!userAction) {
        userAction = {'uid': uid, 'actions': {[week]: {[action]: number}}};
        this.create(userAction);
        return;
      }
        
      if (userAction.actions[week]) {
        let exists = false;
        Object.keys(userAction.actions[week]).forEach(id => {
          if (id === action) {
            userAction.actions[week][action] += number;
            exists = true;
          }
        });
        if (!exists) {
          userAction.actions[week][action] = number;
        }
      } else {
        userAction.actions[week] = {[action]: number};
      }
      this.update(userAction);
    });
  }

  get(uid: string): Promise<{ id?: string, uid: string, actions: any }> {
    return this.ref?.where('uid', '==', uid).get().then(function(querySnapshot) {
      const action = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        action.push({
            id: doc.id,
            uid: data.uid || '',
            actions: data.actions || {},
          });
      });
      return action[0];
    });
  }

  create = (data: any): void => {
    this.ref?.add(data)
  };
  update = (data: any): void => {
    this.ref?.doc(data.id).set(data)
  };
}
