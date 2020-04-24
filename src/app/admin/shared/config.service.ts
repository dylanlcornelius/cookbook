import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Config } from './config.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  ref = firebase.firestore().collection('configs');

  constructor(private firestoreService: FirestoreService) {}

  getConfigs(): Promise<Config[]> {
    return new Promise(resolve => {
      this.firestoreService.get(this.ref).then(docs => {
        resolve(docs.map(doc => {
          return new Config(doc);
        }));
      });
    });
  }

  getConfig(name: string): Promise<Config> {
    return new Promise(resolve => {
      this.ref.where('name', '==', name).get().then(function(querySnapshot) {
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
    return this.firestoreService.post(this.ref, data);
  }

  putConfig(data: Config) {
    this.firestoreService.put(this.ref, data.getId(), data.getObject());
  }

  putConfigs(data: Array<Config>) {
    data.forEach(d => {
      this.ref.doc(d.getId()).set(d.getObject());
    });
  }

  deleteConfig(id: string) {
    this.ref.doc(id).delete();
  }
}
