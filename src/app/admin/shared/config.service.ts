import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Config } from './config.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('configs');
    }
    return this.ref;
  }

  constructor(private firestoreService: FirestoreService) {}

  getConfigs(): Observable<Config[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new Config(doc);
        }));
      });
    });
  }

  getConfig(name: string): Promise<Config> {
    return new Promise(resolve => {
      this.getRef()?.where('name', '==', name).get().then(function(querySnapshot) {
        const configs = [];
        querySnapshot.forEach((doc) => {
          configs.push(new Config({
            ...doc.data(),
            id: doc.id
          }));
        });
        resolve(configs[0]);
      });
    });
  }

  postConfig(data: Config): String {
    return this.firestoreService.post(this.getRef(), data);
  }

  putConfig(data: Config) {
    this.firestoreService.put(this.getRef(), data.getId(), data.getObject());
  }

  putConfigs(data: Array<Config>) {
    this.firestoreService.putAll(this.getRef(), data);
  }

  deleteConfig(id: string) {
    this.firestoreService.delete(this.getRef(), id);
  }
}
