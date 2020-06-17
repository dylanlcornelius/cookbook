import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserIngredientService } from './user-ingredient.service';
import { FirestoreService } from '@firestoreService';
import { UserIngredient } from './user-ingredient.model';
import { of } from 'rxjs';

describe('UserIngredientService', () => {
  let service: UserIngredientService
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIngredientService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserIngredients', () => {
    it('should get all documents', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getUserIngredients().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('getUserIngredient', () => {
    it('should get one document based on an id', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));
      spyOn(service, 'postUserIngredient');

      service.getUserIngredient('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
      expect(service.postUserIngredient).not.toHaveBeenCalled();
    });

    it('should create a document if none are found', fakeAsync(() => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([]));
      spyOn(service, 'postUserIngredient').and.returnValue('id');

      service.getUserIngredient('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
      expect(service.postUserIngredient).toHaveBeenCalled();
    }));
  });

  describe('postUserIngredient', () => {
    it('should create a new document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'post');

      service.postUserIngredient(new UserIngredient({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putUserIngredient', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'put');

      service.putUserIngredient(new UserIngredient({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('putUserIngredients', () => {
    it('should update user ingredients', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'putAll');

      service.putUserIngredients([new UserIngredient({})]);

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.putAll).toHaveBeenCalled();
    });
  });
});
