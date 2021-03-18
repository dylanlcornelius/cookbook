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

  describe('get', () => {
    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'create');

      service.create({});

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'update');

      service.update({}, 'id');

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.update).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'updateAll');

      service.update([new Recipe({})]);

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'delete');

      service.delete('id');

      expect(firestoreService.getRef).toHaveBeenCalled();
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
    it('should update a recipe with a rating', () => {
      spyOn(service, 'calculateMeanRating');
      spyOn(service, 'update');

      service.rateRecipe(1, 'uid', new Recipe({}));

      expect(service.calculateMeanRating).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });

    it('should update a recipe with a rating', () => {
      spyOn(service, 'calculateMeanRating');
      spyOn(service, 'update');

      service.rateRecipe(0, 'uid', new Recipe({}));

      expect(service.calculateMeanRating).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });
});
