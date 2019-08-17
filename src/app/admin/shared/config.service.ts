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
        const configs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          configs.push(new Config(doc.id, data.name || '', data.value || ''));
        });
        observer.next(configs);
      });
    });
  }

  getConfig(name: string): Observable<Config> {
    return new Observable((observer) => {
      this.ref.where('name', '==', name).get().then(function(querySnapshot) {
        const configs = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          configs.push(new Config(doc.id, data.name || '', data.value || ''));
        });
        observer.next(configs[0]);
      });
    });
  }

  postConfig(data: Config): Observable<Config> {
    return new Observable((observer) => {
      this.ref.add(data.getObject()).then((doc) => {
        observer.next(new Config(doc.id, data.name || '', data.value || ''));
      });
    });
  }

  putConfig(data: Config): Observable<Config> {
    return new Observable((observer) => {
      this.ref.doc(data.getId()).set(data.getObject()).then(() => {
        observer.next();
      });
    });
  }

  putConfigs(data: Array<Config>) {
    data.forEach(d => {
      this.ref.doc(d.getId()).set(d.getObject());
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
