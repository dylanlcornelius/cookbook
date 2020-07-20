import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/storage';
import { Observable } from 'rxjs';
import { Recipe } from '../recipe/shared/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  ref;
  getRef() {
    if (!this.ref && firebase.apps.length > 0) {
      this.ref = firebase.storage().ref();
    }
    return this.ref;
  }

  constructor() {}

  getFile(path: string) {
    return this.getRef().child(path).getDownloadURL().then(url => {
      return url;
    }, () => {});
  }

  uploadFile(path: string, file: File): Observable<Number | String | void> {
    const uploadTask = this.getRef().child(path).put(file);

    return new Observable(observer => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        observer.next(progress);
      }, error => {
        console.log(error);
      }, () => {
        this.getFile(path).then(url => {
          observer.next(url);
        });
      });
    });
  }

  downloadFile(doc) {
    if (!doc.hasImage) {
      return Promise.reject();
    }

    return this.getFile(doc.id);
  }

  deleteFile(path: string) {
    return this.getRef().child(path).delete();
  }
}
