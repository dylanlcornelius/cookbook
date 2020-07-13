import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { Recipe } from '../recipe/shared/recipe.model';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('downloadFile', () => {
    it('should handle a recipe without an image', () => {
      spyOn(service, 'getFile');

      service.downloadFile(new Recipe({})).then(() => {}, () => {});

      expect(service.getFile).not.toHaveBeenCalled();
    });

    it('should handle a recipe with an image', () => {
      spyOn(service, 'getFile');

      service.downloadFile(new Recipe({hasImage: true}));

      expect(service.getFile).toHaveBeenCalled();
    });
  });
});
