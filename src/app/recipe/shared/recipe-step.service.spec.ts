import { TestBed } from '@angular/core/testing';

import { RecipeStepService } from '@recipeStepService';
import { Recipe } from '@recipe';

describe('RecipeStepService', () => {
  let service: RecipeStepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildRecipeSteps', () => {
    it('should find all ingredients for a recipe', () => {
      const recipes = [
        new Recipe({
          id: '1',
          steps: [{ step: 'step 1' }, { recipeId: '2' }],
        }),
        new Recipe({
          id: '2',
          steps: [{ step: 'step 2' }, { recipeId: '3' }],
        }),
        new Recipe({
          id: '3',
          steps: [{ step: 'step 3' }],
        }),
      ];

      const result = service.buildRecipeSteps(recipes[0], recipes);

      expect(result).toEqual([
        { step: 'step 1' },
        {
          recipeId: '2',
          recipeName: '',
          recipeSteps: [
            { step: 'step 2' },
            { recipeId: '3', recipeName: '', recipeSteps: [{ step: 'step 3' }] },
          ],
        },
      ]);
    });

    it('should handle circularly dependent recipe ingredients', () => {
      const recipes = [
        new Recipe({
          id: '1',
          steps: [{ step: 'step 1' }, { recipeId: '2' }],
        }),
        new Recipe({
          id: '2',
          steps: [{ step: 'step 2' }, { recipeId: '3' }],
        }),
        new Recipe({
          id: '3',
          steps: [{ step: 'step 3' }, { recipeId: '2' }],
        }),
      ];

      const result = service.buildRecipeSteps(recipes[0], recipes);

      expect(result).toEqual([
        { step: 'step 1' },
        {
          recipeId: '2',
          recipeName: '',
          recipeSteps: [
            { step: 'step 2' },
            {
              recipeId: '3',
              recipeName: '',
              recipeSteps: [
                { step: 'step 3' },
                {
                  recipeId: '2',
                  recipeName: '',
                  recipeSteps: [{ step: 'step 2' }, { recipeId: '3' }],
                },
              ],
            },
          ],
        },
      ]);
    });
  });
});
