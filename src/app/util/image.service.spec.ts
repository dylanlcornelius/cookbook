import { TestBed } from '@angular/core/testing';

import { ImageService } from '@imageService';
import { Recipe } from '@recipe';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get a file url', () => {
      const ref = spyOnProperty(service, 'ref');
    
      service.get('path');

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('upload', () => {
    it('should upload a file', () => {
      const ref = spyOnProperty(service, 'ref');
    
      service.upload('path', null);

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('download', () => {
    it('should handle a recipe without an image', () => {
      spyOn(service, 'get');

      service.download(new Recipe({})).then(() => {}, () => {});

      expect(service.get).not.toHaveBeenCalled();
    });

    it('should handle a recipe with an image', () => {
      spyOn(service, 'get');

      service.download(new Recipe({hasImage: true}));

      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', () => {
      const ref = spyOnProperty(service, 'ref');
    
      service.deleteFile('path');

      expect(ref).toHaveBeenCalled();
    });
  });
});
