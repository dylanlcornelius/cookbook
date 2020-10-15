import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Config } from './config.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('configs');
    }
    return this._ref;
  }

  constructor(private firestoreService: FirestoreService) {}

  get(name: string): Observable<Config>;
  get(): Observable<Config[]>;
  get(name?: string): Observable<Config | Config[]> {
    if (name) {
      return new Observable(observer => {
        this.firestoreService.get(this.ref, name, 'name').subscribe(docs => {
          observer.next(new Config(docs[0]));
        });
      });
    } else {
      return new Observable(observable => {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observable.next(docs.map(doc => new Config(doc)));
        });
      });
    }
  }

  create(data: Config): String {
    return this.firestoreService.create(this.ref, data);
  }

  update(data: Config | Array<Config>) {
    if (!Array.isArray(data)) {
      this.firestoreService.update(this.ref, data.getId(), data.getObject());
    } else {
      this.firestoreService.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    this.firestoreService.delete(this.ref, id);
  }
}
