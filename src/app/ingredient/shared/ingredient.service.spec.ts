import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { FirestoreService } from '@firestoreService';

import { IngredientService } from './ingredient.service';
import { Ingredient } from './ingredient.model';

describe('IngredientService', () => {
  let service: IngredientService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
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

    it('should update all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'updateAll');

      service.update([new Ingredient({})]);

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
});
