import { Action } from '@actions';
import { ActionService } from '@actionService';
import { Injectable } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { CollectionReference, FirebaseService, Query } from '@firebaseService';
import { Model as BaseModel } from '@model';
import { DocumentSnapshot, QueryDocumentSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export abstract class FirestoreService<Model extends BaseModel> {
  ref: CollectionReference<Model>;

  constructor(
    private collectionPath: string,
    public factory: (data: any) => Model,
    protected firebase: FirebaseService,
    protected currentUserService: CurrentUserService,
    protected actionService: ActionService
  ) {
    this.load();
  }

  load(): void {
    if (this.firebase.appLoaded && !this.ref && this.collectionPath) {
      this.ref = this.firebase.collection(
        this.firebase.firestore,
        this.collectionPath
      ) as CollectionReference<Model>;
    }
  }

  commitAction(action?: Action): void {
    if (!action) {
      return;
    }

    this.currentUserService
      .getCurrentUser()
      .pipe(first())
      .subscribe((user) => {
        this.actionService.commitAction(user.uid, action, 1);
      });
  }

  construct(snapshot: DocumentSnapshot<Model> | QueryDocumentSnapshot<Model>): Model {
    return this.factory({ ...snapshot.data(), id: snapshot.id });
  }

  getById(id: string): Observable<Model> {
    return new Observable((observable) => {
      this.firebase.onSnapshot<Model>(this.firebase.doc(this.ref, id)).subscribe((snapshot) => {
        observable.next(this.construct(snapshot));
      });
    });
  }

  getByQuery(ref: Query<Model>): Observable<Model[]> {
    return new Observable((observable) => {
      this.firebase.onSnapshot<Model>(ref).subscribe((snapshot) => {
        const docs: Model[] = [];
        snapshot.forEach((doc) => {
          docs.push(this.construct(doc));
        });
        observable.next(docs);
      });
    });
  }

  getAll(): Observable<Model[]> {
    return new Observable((observable) => {
      this.firebase.onSnapshot<Model>(this.ref).subscribe((snapshot) => {
        const docs: Model[] = [];
        snapshot.forEach((doc) => {
          docs.push(this.construct(doc));
        });
        observable.next(docs);
      });
    });
  }

  create(data: ReturnType<Model['getObject']>, action?: Action): string {
    this.commitAction(action);

    const currentDoc = this.firebase.doc(this.ref);
    this.firebase.setDoc(currentDoc, { ...data, creationDate: new Date() });
    return currentDoc.id;
  }

  updateOne(data: ReturnType<Model['getObject']>, id: string, action?: Action): void {
    this.commitAction(action);

    const currentDoc = this.firebase.doc(this.ref, id);
    this.firebase.setDoc(currentDoc, data);
  }

  updateAll(data: Model[]): void {
    data.forEach((d) => {
      const currentDoc = this.firebase.doc(this.ref, d.getId());
      this.firebase.setDoc(currentDoc, d.getObject());
    });
  }

  update(data: ReturnType<Model['getObject']> | Model[], id?: string, action?: Action): void {
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
