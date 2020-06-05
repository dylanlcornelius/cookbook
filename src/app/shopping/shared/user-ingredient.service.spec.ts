import { TestBed } from '@angular/core/testing';

import { UserIngredientService } from './user-ingredient.service';
import { FirestoreService } from '@firestoreService';
import { UserIngredient } from './user-ingredient.model';

describe('UserIngredientService', () => {
  let service: UserIngredientService
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(UserIngredientService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
