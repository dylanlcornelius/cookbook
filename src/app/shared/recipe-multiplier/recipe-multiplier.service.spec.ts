import { TestBed } from '@angular/core/testing';

import { RecipeMultiplierService } from './recipe-multiplier.service';

describe('RecipeMultiplierService', () => {
  let service: RecipeMultiplierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeMultiplierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getQuantity', () => {
    it('should return default quantities', () => {
      const quantity = service.getQuantity('recipeId', undefined, undefined);

      expect(quantity).toEqual(1);
    });

    it('should return scaled quantities', () => {
      service.multipliers = { recipeId: 3 };

      const quantity = service.getQuantity('recipeId', '2', '1');

      expect(quantity).toEqual(1.5);
    });

    it('should return scaled quantities from fractions', () => {
      service.multipliers = { recipeId: 3 };

      const quantity = service.getQuantity('recipeId', '2', '1/2');

      expect(quantity).toEqual(0.75);
    });
  });

  describe('decrement', () => {
    it('should default to the recipe servings', () => {
      service.decrement('recipeId', undefined);

      expect(service.multipliers.recipeId).toEqual(1);
    });

    it('should not go below zero', () => {
      service.multipliers = { recipeId: 1 };

      service.decrement('recipeId', '1');

      expect(service.multipliers.recipeId).toEqual(1);
    });

    it('should lower the recipe multiplier', () => {
      service.multipliers = { recipeId: 3 };

      service.decrement('recipeId', '1');

      expect(service.multipliers.recipeId).toEqual(2);
    });
  });

  describe('increment', () => {
    it('should default to the recipe servings', () => {
      service.increment('recipeId', undefined);

      expect(service.multipliers.recipeId).toEqual(2);
    });

    it('should raise the recipe multiplier', () => {
      service.multipliers = { recipeId: 3 };

      service.increment('recipeId', '1');

      expect(service.multipliers.recipeId).toEqual(4);
    });
  });
});
