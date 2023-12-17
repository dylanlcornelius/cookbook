import { Injectable } from '@angular/core';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { Action } from '@actions';
import { Models, ModelObject } from '@model';
import { first } from 'rxjs/operators';
import { CollectionReference, FirebaseService, Query } from '@firebaseService';

@Injectable({
  providedIn: 'root',
})
export abstract class FirestoreService {
  ref: CollectionReference;

  constructor(
    private collectionPath: string,
    protected firebase: FirebaseService,
    protected currentUserService: CurrentUserService,
    protected actionService: ActionService
  ) {
    this.load();
  }

  load(): void {
    if (this.firebase.appLoaded && !this.ref && this.collectionPath) {
      this.ref = this.firebase.collection(this.firebase.firestore, this.collectionPath);
    }
  }

  commitAction(action: Action): void {
    if (!action) {
      return;
    }

    this.currentUserService
      .getCurrentUser()
      .pipe(first())
      .subscribe(user => {
        this.actionService.commitAction(user.uid, action, 1);
      });
  }

  getOne(id: string): Observable<any> {
    return new Observable(observable => {
      this.firebase.onSnapshot(this.firebase.doc(this.ref, id)).subscribe(snapshot => {
        observable.next({ ...snapshot.data(), id: snapshot.id });
      });
    });
  }

  getMany(ref?: Query): Observable<any> {
    return new Observable(observable => {
      this.firebase.onSnapshot(ref || this.ref).subscribe(snapshot => {
        const docs = [];
        snapshot.forEach(doc => {
          docs.push({ ...doc.data(), id: doc.id });
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

    const currentDoc = this.firebase.doc(this.ref);
    this.firebase.setDoc(currentDoc, { ...data, creationDate: new Date() });
    return currentDoc.id;
  }

  updateOne(data: ModelObject, id: string, action?: Action): void {
    this.commitAction(action);

    const currentDoc = this.firebase.doc(this.ref, id);
    this.firebase.setDoc(currentDoc, data);
  }

  updateAll(data: Models): void {
    data.forEach(d => {
      const currentDoc = this.firebase.doc(this.ref, d.getId());
      this.firebase.setDoc(currentDoc, d.getObject());
    });
  }

  update(data: ModelObject | Models, id?: string, action?: Action): void {
    if (id && !Array.isArray(data)) {
      this.updateOne(data, id, action);
    } else if (Array.isArray(data)) {
      this.updateAll(data);
    }
  }

  delete(id: string, action?: Action): void {
    this.commitAction(action);

    const currentDoc = this.firebase.doc(this.ref, id);
    this.firebase.deleteDoc(currentDoc);
  }
}
