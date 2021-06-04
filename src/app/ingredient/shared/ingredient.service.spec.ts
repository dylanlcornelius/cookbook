import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { FirestoreService } from '@firestoreService';

import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';
import { NumberService } from 'src/app/util/number.service';

describe('IngredientService', () => {
  let service: IngredientService;
  let numberService: NumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientService);
    numberService = TestBed.inject(NumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of({}));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
        expect(doc.getObject().name).toEqual('');
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'create');

      service.create({});

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'update');

      service.update({}, 'id');

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.update).toHaveBeenCalled();
    });

    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Ingredient({})]);

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });

  describe('sort', () => {
    it('should delete a document', () => {
      const result = service.sort(new Ingredient({name: 'a'}), new Ingredient({name: 'b'}));

      expect(result).toEqual(-1);
    });
  });

  describe('buildRecipeIngredients', () => {
    it('should build ingredients', () => {
      const recipeIngredients = [new Ingredient({ id: 'id' }), new Ingredient({ id: 'id2' })];
      const ingredients = [new Ingredient({ id: 'id'})];
      
      spyOn(numberService, 'toFormattedFraction').and.returnValue('1/2');

      const result = service.buildRecipeIngredients(recipeIngredients, ingredients);

      expect(result.length).toEqual(1);
      expect(numberService.toFormattedFraction).toHaveBeenCalled();
    });
  });
});
