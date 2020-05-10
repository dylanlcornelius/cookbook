import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { FirestoreService } from '@firestoreService';

import { RecipeService } from './recipe.service';

describe('RecipeService', () => {
  let service: RecipeService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(RecipeService);
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

  describe('deleteRecipe', () => {
    it('should delete a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'delete');

      service.deleteRecipe('id');

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
