import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './user.model';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from './current-user.service';
import { ActionService } from '@actionService';

@Injectable({
  providedIn: 'root'
})
export class UserService extends FirestoreService {
  get ref() {
    return super.getRef('users');
  }

  constructor(
    currentUserService: CurrentUserService,
    actionService: ActionService,
  ) {
    super(currentUserService, actionService);
  }

  get(uid: string): Observable<User>;
  get(): Observable<User[]>;
  get(uid?: string): Observable<User | User[]> {
    return new Observable(observer => {
      if (uid) {
        super.get(this.ref?.where('uid', '==', uid)).subscribe(docs => {
          observer.next(docs[0] ? new User(docs[0]) : undefined);
        });
      } else {
          super.get(this.ref).subscribe(docs => {
            observer.next(docs.map(doc => new User(doc)));
          });
      }
    });
}

  create(data: User): string {
    return super.create(this.ref, data.getObject());
  }

  update(data: User | User[]) {
    if (!Array.isArray(data)) {
      super.update(this.ref, data.getId(), data.getObject());
    } else {
      super.updateAll(this.ref, data);
    }
  }

  delete(id: string) {
    super.delete(this.ref, id);
  }
}
