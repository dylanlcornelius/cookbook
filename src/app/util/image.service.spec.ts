import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
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
});
