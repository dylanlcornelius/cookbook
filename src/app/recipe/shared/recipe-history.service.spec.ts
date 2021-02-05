import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { RecipeHistory } from './recipe-history.model';

import { RecipeHistoryService } from './recipe-history.service';

describe('RecipeHistoryService', () => {
  let service: RecipeHistoryService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeHistoryService);
    firestoreService = TestBed.inject(FirestoreService);
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

  describe('get', () => {
    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get('uid').subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.get('uid', 'recipeId').subscribe(doc => {
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

      service.create(new RecipeHistory({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'update');

      service.update(new RecipeHistory({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.update).toHaveBeenCalled();
    });
  });
});
