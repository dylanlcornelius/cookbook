import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Action } from '@actions';
import { Model, ModelObject } from '@model';
import { first } from 'rxjs/operators';
import { collection, getFirestore, CollectionReference, doc, Query, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { getApps } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export abstract class FirestoreService {
    
  ref: CollectionReference;

  constructor(
    collectionPath: string,
    protected currentUserService: CurrentUserService,
    protected actionService: ActionService,
  ) {
    if (getApps().length > 0 && !this.ref && collectionPath) {
      this.ref = collection(getFirestore(), collectionPath);
    }
  }

  commitAction(action: Action): void {
    if (!action) {
      return;
    }

    this.currentUserService.getCurrentUser().pipe(first()).subscribe(user => {
      this.actionService.commitAction(user.uid, action, 1);
    });
  }

  getOne(id: string): Observable<any> {
    return new Observable(observable => {
      onSnapshot(doc(this.ref, id), (snapshot => {
        observable.next({
          ...snapshot.data(),
          id: snapshot.id
        });
      }));
    });

  }

  getMany(ref?: Query): Observable<any> {
    return new Observable(observable => {
      onSnapshot(ref || this.ref, (snapshot => {
        const docs = [];
        snapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            id: doc.id
          });
        });
        observable.next(docs);
      }));
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

    const currentDoc = doc(this.ref);
    setDoc(currentDoc, { ...data, creationDate: new Date() });
    return currentDoc?.id;
  }

  updateOne(data: ModelObject, id: string, action?: Action): void {
    this.commitAction(action);

    const currentDoc = doc(this.ref, id);
    setDoc(currentDoc, data);
  }

  updateAll(data: Model[]): void {
    data.forEach(d => {
      const currentDoc = doc(this.ref, d.getId());
      setDoc(currentDoc, d.getObject());
    });
  }

  update(data: ModelObject | Model[], id?: string, action?: Action): void {
    if (id && !Array.isArray(data)) {
      this.updateOne(data, id, action);
    } else if (Array.isArray(data)) {
      this.updateAll(data);
    }
  }

  delete(id: string, action?: Action): void {
    this.commitAction(action);
    
    const currentDoc = doc(this.ref, id);
    deleteDoc(currentDoc);
  }
}
