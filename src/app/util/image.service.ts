import { Injectable } from '@angular/core';
import { ref, getDownloadURL, deleteObject, uploadBytesResumable, getStorage } from 'firebase/storage';
import { Recipe } from '@recipe';
import { User } from '@user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  get(path: string): Promise<string | void> {
    const storageRef = ref(getStorage(), path);
    return getDownloadURL(storageRef).then(url => {
      return url;
    }, () => {});
  }

  upload(path: string, file: File | Blob): Observable<number | string | void> {
    const storageRef = ref(getStorage(), path);
    const uploadTask = uploadBytesResumable(storageRef, file, { cacheControl: 'public,max-age=31557600' });

    return new Observable(observer => {
      uploadTask?.on("state_changed", snapshot => {
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
    const storageRef = ref(getStorage(), path);
    return deleteObject(storageRef);
  }
}
