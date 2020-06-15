import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { ActionService } from '@actionService';
import { Observable } from 'rxjs';
import { CurrentUserService } from '../user/shared/current-user.service';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private currentUserService: CurrentUserService,
    private actionService: ActionService,
  ) {}

  private commitAction(action) {
    if (action) {
      this.currentUserService.getCurrentUser().subscribe(user => {
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
  
  // TODO: create getOneWhere
  get(ref, id?: string): Observable<any> {
    if (id) {
      return this.getOne(ref, id);
    } else {
      return this.getMany(ref);
    }
  }

  post(ref, data, action?): string {
    this.commitAction(action);

    const newDoc = ref?.doc();
    newDoc.set(data);
    return newDoc.id;
  }

  put(ref, id: string, data, action?) {
    this.commitAction(action);

    ref?.doc(id).set(data);
  }

  putAll(ref, data) {
    data.forEach(d => {
      ref.doc(d.getId()).set(d.getObject());
    });
  }

  delete(ref, id: string, action?) {
    this.commitAction(action);
    
    ref?.doc(id).delete();
  }
}
