import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { RecipeHistory } from '@recipeHistory';

import { RecipeHistoryService } from '@recipeHistoryService';

describe('RecipeHistoryService', () => {
  let service: RecipeHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('add', () => {
    it('should create a recipe history', () => {
      const recipeHistory = new RecipeHistory({});

      spyOn(service, 'get').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');
      
      service.add('uid', 'recipeId');

      expect(service.get).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should update a recipe history', () => {
      const recipeHistory = new RecipeHistory({id: 'id'});

      spyOn(service, 'get').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');
      
      service.add('uid', 'recipeId');

      expect(service.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should create a recipe history with a value', () => {
      const recipeHistory = new RecipeHistory({});

      spyOn(service, 'get').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');
      
      service.set('uid', 'recipeId', 10);

      expect(service.get).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should update a recipe history with a value', () => {
      const recipeHistory = new RecipeHistory({id: 'id'});

      spyOn(service, 'get').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');
      
      service.set('uid', 'recipeId', 10);

      expect(service.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of({}));
      spyOn(FirestoreService.prototype, 'get');

      service.get('uid', 'recipeId').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');

      service.get('uid').subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getMany');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([]));

      service.get().subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).not.toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new RecipeHistory({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'update');

      service.update(new RecipeHistory({}));

      expect(FirestoreService.prototype.update).toHaveBeenCalled();
    });
  });
});
