import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  _ref;
  get ref() {
    if (!this._ref) {
      this._ref = this.firestoreService.getRef('users');
    }
    return this._ref;
  }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  get(uid: string): Observable<User>;
  get(): Observable<User[]>;
  get(uid?: string): Observable<User | User[]> {
    if (uid) {
      return new Observable(observable => {
        this.firestoreService.get(this.ref, uid, 'uid').subscribe(docs => {
          observable.next(docs[0] ? new User(docs[0]) : undefined);
        });
      });
    } else {
      return new Observable(observable => {
        this.firestoreService.get(this.ref).subscribe(docs => {
          observable.next(docs.map(doc => new User(doc)));
        });
      });
    }
  }

  create(data: User): string {
    return this.firestoreService.create(this.ref, data.getObject());
  }

  update(data: User | User[]) {
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
