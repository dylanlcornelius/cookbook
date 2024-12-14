import { Injectable } from '@angular/core';
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
import { getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentSnapshot,
  enableMultiTabIndexedDbPersistence,
  Firestore,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  Query,
  QuerySnapshot,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  appLoaded = false;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  analytics: Analytics;

  // FIREBASE
  initializeApp = initializeApp;
  getApps = getApps;

  // FIRESTORE
  getFirestore = getFirestore;
  enableMultiTabIndexedDbPersistence = enableMultiTabIndexedDbPersistence;
  collection = collection;
  doc = <Model>(reference: any, path?: any): DocumentReference<Model> =>
    path ? doc<Model>(reference, path) : doc<Model>(reference);
  getDocs = getDocs;
  onSnapshot<Model>(reference: DocumentReference<Model>): Observable<DocumentSnapshot<Model>>;
  onSnapshot<Model>(reference: Query<Model>): Observable<QuerySnapshot<Model>>;
  onSnapshot<Model>(reference: CollectionReference<Model>): Observable<CollectionReference<Model>>;
  onSnapshot<Model>(
    reference: Query<Model> | CollectionReference<Model>
  ): Observable<QuerySnapshot<Model> | CollectionReference<Model>>;
  onSnapshot<Model>(
    reference: DocumentReference<Model> | Query<Model> | CollectionReference<Model>
  ): Observable<DocumentSnapshot<Model> | QuerySnapshot<Model> | CollectionReference<Model>> {
    return new Observable<DocumentSnapshot<Model> | QuerySnapshot<Model>>((observable) => {
      if (reference.type === 'document') {
        onSnapshot<Model>(reference, (snapshot: DocumentSnapshot<Model>) =>
          observable.next(snapshot)
        );
      } else {
        onSnapshot<Model>(reference, (snapshot: QuerySnapshot<Model>) => observable.next(snapshot));
      }
    });
  }
  query = query;
  where = where;
  addDoc = addDoc;
  setDoc = setDoc;
  deleteDoc = deleteDoc;

  // AUTH
  getAuth = getAuth;
  onAuthStateChanged = (next: any): any => this.auth.onAuthStateChanged(next);
  signInWithPopup = signInWithPopup;
  signOut = (): any => this.auth.signOut();

  // STORAGE
  getStorage = getStorage;
  ref = ref;
  getDownloadURL = getDownloadURL;
  uploadBytesResumable = uploadBytesResumable;
  deleteObject = deleteObject;

  // ANALYTICS
  getAnalytics = getAnalytics;
  logEvent = (event: string, args?: any): void => logEvent(this.analytics, event, args);
}

export {
  // FIRESTORE
  CollectionReference,
  // AUTH
  GoogleAuthProvider,
  Query,
};
