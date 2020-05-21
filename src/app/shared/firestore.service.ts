import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { ActionService } from '@actionService';
import { UserService } from '@userService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private userService: UserService,
    private actionService: ActionService,
  ) {}

  private commitAction(action) {
    if (action) {
      this.userService.getCurrentUser().subscribe(user => {
        this.actionService.commitAction(user.uid, action, 1);
      });
    }
  }

  getOne(ref, id: string) {
    return new Observable(observable => {
      ref?.doc(id).get().then(doc => {
        observable.next({
          ...doc.data(),
          id: doc.id
        });
      });
    });
  }

  getMany(ref) {
    return new Observable(observable => {
      ref?.onSnapshot(querySnapshot => {
        const docs = [];
        querySnapshot.forEach(doc => {
          docs.push({
            ...doc.data(),
            id: doc.id
          });
        });
        observable.next(docs);
      });
    });
  }

  get(ref, id?: string): Observable<any> {
    if (id) {
      return this.getOne(ref, id);
    } else {
      return this.getMany(ref);
    }
  }

  post(ref, data, action?): String {
    this.commitAction(action);

    const newDoc = ref?.doc();
    newDoc.set(data);
    return newDoc.id;
  }

  put(ref, id: string, data, action?) {
    this.commitAction(action);

    ref?.doc(id).set(data);
  }

  delete(ref, id: string, action?) {
    this.commitAction(action);
    
    ref?.doc(id).delete();
  }
}
