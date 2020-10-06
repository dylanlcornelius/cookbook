import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Action } from './action.enum';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  _ref;
  get ref() {
    if (!this._ref && firebase.apps.length > 0) {
      this._ref = firebase.firestore().collection('user-actions');
    }
    return this._ref;
  }

  constructor() {}

  // TODO: rework action data model
  commitAction(uid: string, action: Action, number: Number) {
    const self = this;

    if (!uid) {
      return;
    }

    this.get(uid).then((userAction) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear()).toString();

      if (!userAction) {
        userAction = {'uid': uid, 'actions': {[week]: {[action]: number}}};
        self.create(userAction);
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
      self.update(userAction);
    });
  }

  get(uid: string) {
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

  create(data) {
    this.ref?.add(data);
  }

  update(data) {
    this.ref?.doc(data.id).set(data);
  }
}
