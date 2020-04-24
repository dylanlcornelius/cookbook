import { Injectable } from '@angular/core';
import '@firebase/firestore';
import { ActionService } from '@actionService';
import { UserService } from '@userService';

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
    return new Promise(resolve => {
      ref.doc(id).get().then((doc) => {
        resolve({
          ...doc.data(),
          id: doc.id
        });
      });
    });
  }

  getMany(ref) {
    return new Promise(resolve => {
      ref.onSnapshot((querySnapshot) => {
        const docs = [];
        querySnapshot.forEach((doc) => {
          docs.push({
            ...doc.data(),
            id: doc.id
          });
        });
        resolve(docs);
      });
    });
  }

  get(ref, id?: string): Promise<any> {
    return new Promise(resolve => {
      if (id) {
        resolve(this.getOne(ref, id));
      } else {}
        resolve(this.getMany(ref));
    });
  }

  post(ref, data, action?): String {
    this.commitAction(action);

    const newDoc = ref.doc();
    newDoc.set(data);
    return newDoc.id;
  }

  put(ref, id: string, data, action?) {
    this.commitAction(action);

    ref.doc(id).set(data);
  }

  delete(ref, id: string, action?) {
    this.commitAction(action);
    
    ref.doc(id).delete();
  }
}
