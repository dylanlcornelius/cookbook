import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  _ref;
  get ref() {
    if (!this._ref && firebase.apps.length > 0) {
      this._ref = firebase.storage().ref();
    }
    return this._ref;
  }

  constructor() {}

  get(path: string) {
    return this.ref.child(path).getDownloadURL().then(url => {
      return url;
    }, () => {});
  }

  upload(path: string, file: File): Observable<Number | String | void> {
    const uploadTask = this.ref.child(path).put(file, { cacheControl: 'public,max-age=31557600' });

    return new Observable(observer => {
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        observer.next(progress);
      }, error => {
        console.log(error);
      }, () => {
        this.get(path).then(url => {
          observer.next(url);
        });
      });
    });
  }

  download(doc) {
    if (!doc.hasImage) {
      return Promise.reject();
    }

    return this.get(doc.id);
  }

  deleteFile(path: string) {
    return this.ref.child(path).delete();
  }
}
