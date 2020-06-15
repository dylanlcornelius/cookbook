import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FirestoreService } from '@firestoreService';

import { RecipeService } from './recipe.service';
import { Recipe } from './recipe.model';

describe('RecipeService', () => {
  let service: RecipeService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filters', () => {
    it('should be able to be retrieved', () => {
      expect(service.selectedFilters).toEqual([]);
    });

    it('should be able to be set', () => {
      service.selectedFilters = ['filter'];
      expect(service.selectedFilters).toEqual(['filter']);
    });
  });

  describe('getRecipes', () => {
    it('should get all documents', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getRecipes().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('getRecipe', () => {
    it('should get one document based on an id', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.getRecipe('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('postRecipe', () => {
    it('should create a new document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'post');

      service.postRecipe({});

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putRecipe', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'put');

      service.putRecipe('id', {});

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('putRecipes', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'putAll');

      service.putRecipes([new Recipe({})]);

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.putAll).toHaveBeenCalled();
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'delete');

      service.deleteRecipe('id');

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });

  describe('calculateMeanRating', () => {
    it('should do nothing when ratings is not defined', () => {
      const result = service.calculateMeanRating(undefined);

      expect(result).toEqual(0);
    });

    it('should set the average to zero when there are no ratings', () => {
      const result = service.calculateMeanRating([]);

      expect(result).toEqual(0);
    });

    it('should return the average of ratings', () => {
      const ratings = [{
        rating: 1,
        uid: 'uid1'
      }, {
        rating: 2,
        uid: 'uid2'
      }];

      const result = service.calculateMeanRating(ratings);

      expect(result).toEqual(50);
    });
  });

  describe('rateRecipe', () => {
    it('should udpate a recipe with a rating', () => {
      spyOn(service, 'calculateMeanRating');

      service.rateRecipe(1, 'uid', new Recipe({}));

      expect(service.calculateMeanRating).toHaveBeenCalled();
    });

    it('should udpate a recipe with a rating', () => {
      spyOn(service, 'calculateMeanRating');

      service.rateRecipe(0, 'uid', new Recipe({}));

      expect(service.calculateMeanRating).toHaveBeenCalled();
    });
  });
});
