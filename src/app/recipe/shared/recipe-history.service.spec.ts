import { TestBed } from '@angular/core/testing';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { RecipeHistory } from '@recipeHistory';
import { RecipeHistoryService } from '@recipeHistoryService';
import { of } from 'rxjs';

describe('RecipeHistoryService', () => {
  let service: RecipeHistoryService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeHistoryService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(RecipeHistory);
    });
  });

  describe('add', () => {
    it('should create a recipe history', () => {
      const recipeHistory = new RecipeHistory({});

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.add('uid', 'recipeId');

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should update a recipe history', () => {
      const recipeHistory = new RecipeHistory({ id: 'id' });

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.add('uid', 'recipeId');

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('should create a recipe history with a value', () => {
      const recipeHistory = new RecipeHistory({});

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.set('uid', 'recipeId', 10, false);

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should create a recipe history with a value and update the last cooked date', () => {
      const recipeHistory = new RecipeHistory({});

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.set('uid', 'recipeId', 10, true);

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should update a recipe history with a value', () => {
      const recipeHistory = new RecipeHistory({ id: 'id' });

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.set('uid', 'recipeId', 10, false);

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });

    it('should update a recipe history with a value and update the last cooked date', () => {
      const recipeHistory = new RecipeHistory({ id: 'id' });

      spyOn(service, 'getByUserAndRecipe').and.returnValue(of(recipeHistory));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.set('uid', 'recipeId', 10, true);

      expect(service.getByUserAndRecipe).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('getByUserAndRecipe', () => {
    it('should get one document based on an id', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));

      service.getByUserAndRecipe('uid', 'recipeId').subscribe((doc) => {
        expect(doc).toBeDefined();
      });

      expect(firebase.where).toHaveBeenCalledTimes(2);
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });
  });

  describe('getByUser', () => {
    it('should get all documents based on a uid', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));

      service.getByUser('uid').subscribe((docs) => {
        expect(docs).toBeDefined();
      });

      expect(firebase.where).toHaveBeenCalledTimes(1);
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
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
