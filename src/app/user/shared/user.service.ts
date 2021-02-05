import { Injectable } from '@angular/core';
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
    return new Observable(observer => {
      if (uid) {
        this.firestoreService.get(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          observer.next(docs[0] ? new User(docs[0]) : undefined);
        });
      } else {
          this.firestoreService.get(this.ref).subscribe(docs => {
            observer.next(docs.map(doc => new User(doc)));
          });
      }
    });
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
