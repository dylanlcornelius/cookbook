import { Injectable } from '@angular/core';
import { firebase } from '@firebase/app';
import '@firebase/storage';
import { Reference  } from '@firebase/storage-types';
import { Recipe } from '@recipe';
import { User } from '@user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  _ref;
  get ref(): Reference {
    if (!this._ref && firebase.apps.length > 0) {
      this._ref = firebase.storage().ref();
    }
    return this._ref;
  }

  get(path: string): Promise<string | void> {
    return this.ref?.child(path).getDownloadURL().then(url => {
      return url;
    }, () => {});
  }

  upload(path: string, file: File): Observable<number | string | void> {
    const uploadTask = this.ref?.child(path).put(file, { cacheControl: 'public,max-age=31557600' });

    return new Observable(observer => {
      uploadTask?.on(firebase.storage.TaskEvent.STATE_CHANGED, snapshot => {
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

  download(doc: Recipe | User): Promise<never | string | void> {
    if (!doc.hasImage) {
      return Promise.reject();
    }

    return this.get(doc.id);
  }

  deleteFile(path: string): Promise<void> {
    return this.ref?.child(path).delete();
  }
}
