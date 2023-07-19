import { Injectable } from '@angular/core';
import { FirebaseService } from '@firebaseService';
import { Recipe } from '@recipe';
import { User } from '@user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  constructor(private firebase: FirebaseService) {}

  get(path: string): Promise<string | void> {
    const storageRef = this.firebase.ref(this.firebase.storage, path);
    return this.firebase.getDownloadURL(storageRef).then(
      url => url,
      () => {}
    );
  }

  upload(path: string, file: File | Blob): Observable<number | string | void> {
    const storageRef = this.firebase.ref(this.firebase.storage, path);
    const uploadTask = this.firebase.uploadBytesResumable(storageRef, file, {
      cacheControl: 'public,max-age=31557600',
    });

    return new Observable(observer => {
      uploadTask.on(
        'state_changed',
        snapshot => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          observer.next(progress);
        },
        () => {},
        () => {
          this.get(path).then(url => {
            observer.next(url);
          });
        }
      );
    });
  }

  download(doc: Recipe | User): Promise<never | string | void> {
    if (!doc.hasImage) {
      return Promise.reject();
    }

    return this.get(doc.id);
  }

  deleteFile(path: string): Promise<void> {
    const storageRef = this.firebase.ref(this.firebase.storage, path);
    return this.firebase.deleteObject(storageRef);
  }
}
