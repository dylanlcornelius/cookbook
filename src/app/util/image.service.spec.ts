import { TestBed, waitForAsync } from '@angular/core/testing';
import { FirebaseService } from '@firebaseService';

import { ImageService } from '@imageService';
import { Recipe } from '@recipe';

describe('ImageService', () => {
  let service: ImageService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get a file url', () => {
      spyOn(firebase, 'ref');
      spyOn(firebase, 'getDownloadURL').and.returnValue(Promise.resolve('url'));

      service.get('path');

      expect(firebase.ref).toHaveBeenCalled();
      expect(firebase.getDownloadURL).toHaveBeenCalled();
    });

    it('should catch an non-existant file url', () => {
      spyOn(firebase, 'ref');
      spyOn(firebase, 'getDownloadURL').and.returnValue(Promise.reject());

      service.get('path');

      expect(firebase.ref).toHaveBeenCalled();
      expect(firebase.getDownloadURL).toHaveBeenCalled();
    });
  });

  describe('upload', () => {
    it('should upload a file', waitForAsync(() => {
      const uploadTask = {
        on: (
          _task: string,
          callback: (props: { bytesTransferred: number; totalBytes: number }) => void,
          _error: () => void,
          final: () => void
        ) => {
          callback({ bytesTransferred: 50, totalBytes: 100 });
          final();
        },
      };

      spyOn(firebase, 'ref');
      spyOn(firebase, 'uploadBytesResumable').and.returnValue(uploadTask);
      spyOn(service, 'get').and.returnValue(Promise.resolve('url'));

      service.upload('path', null).subscribe(url => {
        expect(url).toBeDefined();
      });

      expect(firebase.ref).toHaveBeenCalled();
      expect(firebase.uploadBytesResumable).toHaveBeenCalled();
      expect(service.get).toHaveBeenCalled();
    }));

    it('should catch an error with uploading a file', waitForAsync(() => {
      const uploadTask = {
        on: (
          _task: string,
          callback: (props: { bytesTransferred: number; totalBytes: number }) => void,
          error: () => void
        ) => {
          callback({ bytesTransferred: 50, totalBytes: 100 });
          error();
        },
      };

      spyOn(firebase, 'ref');
      spyOn(firebase, 'uploadBytesResumable').and.returnValue(uploadTask);
      spyOn(service, 'get').and.returnValue(Promise.resolve('url'));

      service.upload('path', null).subscribe(() => {});

      expect(firebase.ref).toHaveBeenCalled();
      expect(firebase.uploadBytesResumable).toHaveBeenCalled();
      expect(service.get).not.toHaveBeenCalled();
    }));
  });

  describe('download', () => {
    it('should handle a recipe without an image', () => {
      spyOn(service, 'get');

      service.download(new Recipe({})).then(
        () => {},
        () => {}
      );

      expect(service.get).not.toHaveBeenCalled();
    });

    it('should handle a recipe with an image', () => {
      spyOn(service, 'get');

      service.download(new Recipe({ hasImage: true }));

      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', () => {
      spyOn(firebase, 'ref');
      spyOn(firebase, 'deleteObject');

      service.deleteFile('path');

      expect(firebase.ref).toHaveBeenCalled();
      expect(firebase.deleteObject).toHaveBeenCalled();
    });
  });
});
