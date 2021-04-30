import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Action } from '@actions';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService {
  private _ref;

  abstract get ref();

  constructor(
    protected currentUserService: CurrentUserService,
    protected actionService: ActionService,
  ) { }

  getRef(collection: string) {
    if (firebase.apps.length > 0 && !this._ref) {
      this._ref = firebase.firestore().collection(collection);
    }
    return this._ref;
  }

  private commitAction(action) {
    if (!action) {
      return;
    }

    this.currentUserService.getCurrentUser().subscribe(user => {
      this.actionService.commitAction(user.uid, action, 1);
    });
  }

  getOne(ref, id: string): Observable<any> {
    return new Observable(observable => {
      ref?.doc(id).onSnapshot(doc => {
        observable.next({
          ...doc.data(),
          id: doc.id
        });
      });
    });
  }

  getMany(ref): Observable<any> {
    return new Observable(observable => {
      ref?.onSnapshot(querySnapshot => {
        const docs = [];
        querySnapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            id: doc.id
          });
        });
        observable.next(docs);
      });
    });
  }

  get(ref, id?: string): Observable<any> {
    if (id) {
      return this.getOne(ref, id);
    } else {
      return this.getMany(ref);
    }
  }

  create(ref, data, action?): string {
    this.commitAction(action);

    const newDoc = ref?.doc();
    newDoc.set(data);
    return newDoc.id;
  }

  updateOne(ref, data, id: string, action?) {
    this.commitAction(action);

    ref?.doc(id).set(data);
  }

  updateAll(ref, data) {
    data.forEach(d => {
      ref.doc(d.getId()).set(d.getObject());
    });
  }

  update(ref, data, id?: string, action?: Action) {
    if (id) {
      this.updateOne(ref, data, id, action);
    } else {
      this.updateAll(ref, data);
    }
  }

  delete(ref, id: string, action?) {
    this.commitAction(action);
    
    ref?.doc(id).delete();
  }
}
