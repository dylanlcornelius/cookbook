import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Action } from './action.enum';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('user-actions');
    }
    return this.ref;
  }

  constructor() {}

  // TODO: rework action data model
  commitAction(uid: string, action: Action, number: Number) {
    const self = this;

    if (!uid) {
      return;
    }

    self.getAction(self, uid).then((userAction) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear()).toString();

      if (!userAction) {
        userAction = {'uid': uid, 'actions': {[week]: {[action]: number}}};
        self.postAction(self, userAction);
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
      self.putAction(self, userAction);
    });
  }

  getActions(uid) {
    return this.getAction(this, uid);
  }

  getAction(self, uid: string) {
    return self.getRef()?.where('uid', '==', uid).get().then(function(querySnapshot) {
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

  postAction(self, data) {
    self.getRef()?.add(data);
  }

  putAction(self, data) {
    self.getRef()?.doc(data.id).set(data);
  }
}
