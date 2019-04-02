import { TestBed } from '@angular/core/testing';

import { UserIngredientService } from './user-ingredient.service';

describe('UserIngredientService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserIngredientService = TestBed.get(UserIngredientService);
    expect(service).toBeTruthy();
  });
});
