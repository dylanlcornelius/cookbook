import { Injectable } from '@angular/core';
import { Action } from '@actions';
import { collection, CollectionReference, doc, setDoc, where, query, addDoc, getFirestore, getDocs } from 'firebase/firestore';
import { getApps } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  ref: CollectionReference;

  constructor() {
    if (!this.ref && getApps().length > 0) {
      this.ref = collection(getFirestore(), 'user-actions');
    }
  }

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
    return getDocs(query(this.ref, where('uid', '==', uid))).then((querySnapshot) => {
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
    addDoc(this.ref, data);
  };
  update = (data: any): void => {
    setDoc(doc(this.ref, data.id), data);
  };
}
