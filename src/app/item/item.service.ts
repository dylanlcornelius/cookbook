import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { CookieService } from 'ngx-cookie-service';
import { ActionService } from 'src/app/profile/action.service';
import { Action } from 'src/app/profile/action.enum';
import { Item } from './item.model';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  ref = firebase.firestore().collection('items');

  constructor(
    private cookieService: CookieService,
    private actionService: ActionService,
  ) { }

  getItems(): Observable<any> {
    return new Observable((observer) => {
      this.ref.onSnapshot((querySnapshot) => {
        const ingredients = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          ingredients.push({
            id: doc.id,
            uid: data.uid || '',
            name: data.name || '',
          });
        });
        observer.next(ingredients);
      });
    });
  }

  getItem(id: string): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).get().then((doc) => {
        const data = doc.data();
        observer.next({
          id: doc.id,
          uid: data.uid || '',
          name: data.name || '',
        });
      });
    });
  }

  postItem(data): Observable<any> {
    return new Observable((observer) => {
      this.ref.add(data).then((doc) => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.CREATE_ITEM, 1);
        // observer.next({
        //   id: doc.id
        // });
        observer.next(new Item(data.uid, data.name, doc.id));
      });
    });
  }

  putItem(id, data): Observable<any> {
    return new Observable((observer) => {
      this.ref.doc(id).set(data).then(() => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.UPDATE_ITEM, 1);
        observer.next();
      });
    });
  }

  deleteItem(id: string): Observable<{}> {
    return new Observable((observer) => {
      this.ref.doc(id).delete().then(() => {
        this.actionService.commitAction(this.cookieService.get('LoggedIn'), Action.DELETE_ITEM, 1);
        observer.next();
      });
    });
  }
}
