import { Injectable, isDevMode } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Action } from './action.enum';

@Injectable({
  providedIn: 'root'
})
export class UserActionService {

  ref = firebase.firestore().collection('user-actions');

  constructor() {}

  commitAction(uid: string, action: Action) {
    const self = this;
    if (uid) {
      self.getAction(self, uid).then(function(userAction) {
        if (userAction) {
          let exists = false;
          Object.keys(userAction.actions).forEach(key => {
            if (key === action) {
              userAction.actions[key]++;
              exists = true;
            }
          });
          if (!exists) {
            userAction.actions[action] = 1;
          }
          self.putAction(self, userAction);
        } else {
          userAction = {'uid': uid, 'actions': {[action]: 1}};
          self.postAction(self, userAction);
        }
      });
    }
  }

  private getAction(self, uid: string) {
    return self.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
      const action = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        action.push({
            key: doc.id,
            uid: data.uid,
            actions: data.actions,
          });
      });
      // return only the first user
      return action[0];
    });
  }

  private postAction(self, data) {
    self.ref.add(data)
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  private putAction(self, data) {
    self.ref.doc(data.key).set(data)
    .catch(function(error) {
      console.error('error: ', error);
    });
  }

  // getAction(uid: string) {
  //   return this.ref.where('uid', '==', uid).get().then(function(querySnapshot) {
  //     let key = '';
  //     querySnapshot.forEach((doc) => {
  //       key = doc.id;
  //     });
  //     // return only the first user
  //     return key;
  //   });
  // }
}
