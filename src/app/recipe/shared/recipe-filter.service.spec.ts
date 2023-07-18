import { TestBed } from '@angular/core/testing';

import {
  RecipeFilterService,
  AuthorFilter,
  CategoryFilter,
  RatingFilter,
  SearchFilter,
  StatusFilter,
  ImageFilter,
  RestrictionFilter,
  TypeFilter,
} from '@recipeFilterService';
import { Recipe, RECIPE_STATUS } from '@recipe';

describe('RecipeFilterService', () => {
  let service: RecipeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('filters', () => {
    it('should be able to be retrieved', () => {
      expect(service.selectedFilters).toEqual([]);
    });

    it('should be able to be set', () => {
      const filter = new AuthorFilter('author');
      service.selectedFilters = [filter];
      expect(service.selectedFilters).toEqual([filter]);
    });
  });

  describe('recipeFilterPredicate', () => {
    it('should filter by author', () => {
      const result = service.recipeFilterPredicate(new Recipe({ author: 'first last' }), [
        new AuthorFilter('first last'),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by type', () => {
      const result = service.recipeFilterPredicate(new Recipe({ type: 'SALAD' }), [
        new TypeFilter('SALAD'),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by restriction', () => {
      const result = service.recipeFilterPredicate(new Recipe({ isVegetarian: true }), [
        new RestrictionFilter('isVegetarian'),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by category', () => {
      const result = service.recipeFilterPredicate(
        new Recipe({ categories: [{ category: 'test' }] }),
        [new CategoryFilter('test')]
      );

      expect(result).toBeTrue();
    });

    it('should not filter by category', () => {
      const result = service.recipeFilterPredicate(
        new Recipe({ categories: [{ category: 'category' }] }),
        [new CategoryFilter('test')]
      );

      expect(result).toBeFalse();
    });

    it('should filter by New!', () => {
      const result = service.recipeFilterPredicate(new Recipe({ hasNewCategory: true }), [
        new CategoryFilter('New!'),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by Needs Image', () => {
      const result = service.recipeFilterPredicate(new Recipe({ hasNeedsImageCategory: true }), [
        new CategoryFilter('Needs Image'),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by rating', () => {
      const result = service.recipeFilterPredicate(new Recipe({ meanRating: 83.3333333 }), [
        new RatingFilter(100),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by status', () => {
      const result = service.recipeFilterPredicate(
        new Recipe({ status: RECIPE_STATUS.PUBLISHED }),
        [new StatusFilter(RECIPE_STATUS.PUBLISHED)]
      );

      expect(result).toBeTrue();
    });

    it('should filter by image', () => {
      const result = service.recipeFilterPredicate(new Recipe({ hasImage: true }), [
        new ImageFilter(true),
      ]);

      expect(result).toBeTrue();
    });

    it('should filter by search', () => {
      const result = service.recipeFilterPredicate(
        new Recipe({
          steps: [{ step: 'thing' }],
          categories: [{ name: 'category' }],
          ingredients: [{ name: 'ingredient' }],
          author: 'testy',
        }),
        [new SearchFilter('test')]
      );

      expect(result).toBeTrue();
    });
  });
});
