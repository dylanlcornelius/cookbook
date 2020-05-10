import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/firestore';
import { Observable } from 'rxjs';
import { Action } from '@actions';
import { Item } from './item.model';
import { FirestoreService } from '@firestoreService';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.firestore().collection('items');
    }
    return this.ref;
  }

  constructor(
    private firestoreService: FirestoreService
  ) {}

  getItems(): Observable<Item[]> {
    return new Observable(observable => {
      this.firestoreService.get(this.getRef()).subscribe(docs => {
        observable.next(docs.map(doc => {
          return new Item(doc);
        }));
      });
    });
  }

  getItem(id: string): Promise<Item> {
    return new Promise(resolve => {
      this.firestoreService.get(this.getRef(), id).subscribe(doc => {
        resolve(new Item(doc));
      });
    });
  }

  postItem(data): String {
    return this.firestoreService.post(this.getRef(), data, Action.CREATE_ITEM);
  }

  putItem(id: string, data) {
    this.firestoreService.put(this.getRef(), id, data, Action.UPDATE_ITEM);
  }

  deleteItem(id: string) {
    this.firestoreService.delete(this.getRef(), id, Action.DELETE_ITEM);
  }
}
