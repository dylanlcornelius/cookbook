import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { CollectionReference, Query } from '@firebase/firestore-types';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Action } from '@actions';
import { ModelObject } from '@model';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService {
  ref: CollectionReference;

  constructor(
    collection: string,
    protected currentUserService: CurrentUserService,
    protected actionService: ActionService,
  ) {
    if (firebase.apps.length > 0 && !this.ref && collection) {
      this.ref = firebase.firestore().collection(collection);
    }
  }

  commitAction(action: Action): void {
    if (!action) {
      return;
    }

    this.currentUserService.getCurrentUser().subscribe(user => {
      this.actionService.commitAction(user.uid, action, 1);
    });
  }

  getOne(id: string): Observable<any> {
    return new Observable(observable => {
      this.ref?.doc(id).onSnapshot(doc => {
        observable.next({
          ...doc.data(),
          id: doc.id
        });
      });
    });
  }

  getMany(ref?: Query): Observable<any> {
    return new Observable(observable => {
      (ref || this.ref)?.onSnapshot(querySnapshot => {
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

  get(id?: string): Observable<any> {
    if (id) {
      return this.getOne(id);
    } else {
      return this.getMany();
    }
  }

  create(data: ModelObject, action?: Action): string {
    this.commitAction(action);

    const newDoc = this.ref?.doc();
    newDoc?.set({ ...data, creationDate: new Date() });
    return newDoc?.id;
  }

  updateOne(data: ModelObject, id: string, action?: Action): void {
    this.commitAction(action);

    this.ref?.doc(id).set(data);
  }

  updateAll(data: ModelObject[]): void {
    data.forEach(d => {
      this.ref?.doc(d.getId()).set(d.getObject());
    });
  }

  update(data: ModelObject | ModelObject[], id?: string, action?: Action): void {
    if (id && !Array.isArray(data)) {
      this.updateOne(data, id, action);
    } else if (Array.isArray(data)) {
      this.updateAll(data);
    }
  }

  delete(id: string, action?: Action): void {
    this.commitAction(action);
    
    this.ref?.doc(id).delete();
  }
}
