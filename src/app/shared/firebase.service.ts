import { Injectable } from '@angular/core';
import {
  collection,
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  where,
  query,
  getDocs,
  CollectionReference,
  Query,
  enableMultiTabIndexedDbPersistence,
  Firestore,
} from 'firebase/firestore';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth, signInWithPopup } from 'firebase/auth';
import {
  deleteObject,
  FirebaseStorage,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { Analytics, getAnalytics, logEvent } from 'firebase/analytics';
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
  doc = (reference: any, path?: any): any => (path ? doc(reference, path) : doc(reference));
  getDocs = (query: any): any => getDocs(query);
  onSnapshot = (reference: any): any =>
    new Observable(observable => onSnapshot(reference, snapshot => observable.next(snapshot)));
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
  uploadBytesResumable = (ref: any, file: any, options: any): any =>
    uploadBytesResumable(ref, file, options);
  deleteObject = deleteObject;

  // ANALYTICS
  getAnalytics = getAnalytics;
  logEvent = (event: string, args?: any): void => logEvent(this.analytics, event, args);
}

export {
  // FIRESTORE
  CollectionReference,
  Query,

  // AUTH
  GoogleAuthProvider,
};
