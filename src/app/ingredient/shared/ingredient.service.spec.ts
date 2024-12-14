import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { FirestoreService } from '@firestoreService';

import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';

describe('IngredientService', () => {
  let service: IngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(Ingredient);
    });
  });

  describe('getAll', () => {
    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getAll').and.returnValue(of([{}]));

      service.getAll().subscribe((docs) => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Ingredient({}).getObject());

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new Ingredient({}), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Ingredient({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });

  describe('sort', () => {
    it('should delete a document', () => {
      const result = service.sort(new Ingredient({ name: 'a' }), new Ingredient({ name: 'b' }));

      expect(result).toEqual(-1);
    });
  });
});
