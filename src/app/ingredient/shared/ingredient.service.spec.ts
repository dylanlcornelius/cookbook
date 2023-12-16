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

  describe('get', () => {
    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of({}));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
        expect(doc.getObject().name).toEqual('');
      });

      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.get).toHaveBeenCalled();
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
