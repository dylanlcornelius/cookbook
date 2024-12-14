import { Injectable } from '@angular/core';
import { Action } from '@actions';
import { CollectionReference, FirebaseService } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export class ActionService {
  ref: CollectionReference;

  constructor(private firebase: FirebaseService) {
    this.load();
  }

  load(): void {
    if (!this.ref && this.firebase.appLoaded) {
      this.ref = this.firebase.collection(this.firebase.firestore, 'user-actions');
    }
  }

  commitAction(uid: string, action: Action, number: number): void {
    if (!uid) {
      return;
    }

    this.get(uid).then((userAction) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = `${weekStart.getDate()}/${
        weekStart.getMonth() + 1
      }/${weekStart.getFullYear()}`.toString();

      if (!userAction) {
        userAction = { uid: uid, actions: { [week]: { [action]: number } } };
        this.create(userAction);
        return;
      }

      if (userAction.actions[week]) {
        let exists = false;
        Object.keys(userAction.actions[week]).forEach((id) => {
          if (id === action) {
            userAction.actions[week][action] += number;
            exists = true;
          }
        });
        if (!exists) {
          userAction.actions[week][action] = number;
        }
      } else {
        userAction.actions[week] = { [action]: number };
      }
      this.update(userAction);
    });
  }

  get(uid: string): Promise<{ id?: string; uid: string; actions: any } | undefined> {
    return this.firebase
      .getDocs(this.firebase.query(this.ref, this.firebase.where('uid', '==', uid)))
      .then((querySnapshot) => {
        const action: { id?: string; uid: string; actions: any }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          action.push({ id: doc.id, uid: data.uid || '', actions: data.actions || {} });
        });
        return action[0];
      });
  }

  create = (data: any): void => {
    this.firebase.addDoc(this.ref, data);
  };
  update = (data: any): void => {
    this.firebase.setDoc(this.firebase.doc(this.ref, data.id), data);
  };
}
