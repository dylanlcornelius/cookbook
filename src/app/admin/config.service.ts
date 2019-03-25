import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Config } from './config.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  ref = firebase.firestore().collection('configs');

  constructor() {}

  getConfigs(): Observable<Config[]> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.push({
            key: doc.id,
            name: data.name || '',
            value: data.value || '',
          });
        });
        observer.next(users);
      });
    });
  }

  getConfig(name: string): Observable<Config> {
    return new Observable((observer) => {
      this.ref.where('name', '==', name).get().then(function(querySnapshot) {
        const configs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          configs.push({
            key: doc.id,
            name: data.name || '',
            value: data.value || '',
          });
        });
        // return only the first config
        observer.next(configs[0]);
      });
    });
  }

  postConfig(data): Observable<Config> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        observer.next({
          key: doc.id,
          name: data.name || '',
          value: data.value || '',
        });
      });
    });
  }

  putConfig(id: string, data): Observable<Config> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        observer.next();
      });
    });
  }

  putConfigs(data) {
    data.forEach(d => {
      this.ref.doc(d.key).set(d);
    });
  }

  deleteConfig(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        observer.next();
      });
    });
  }
}
