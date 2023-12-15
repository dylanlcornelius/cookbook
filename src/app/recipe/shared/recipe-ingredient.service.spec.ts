import { TestBed, waitForAsync } from '@angular/core/testing';
import { NotificationService, RecipeIngredientModalService } from '@modalService';
import { Recipe } from '@recipe';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { UOM } from '@uoms';
import { UomService } from '@uomService';

import { RecipeIngredientService } from '@recipeIngredientService';
import { Ingredient } from '@ingredient';
import { NumberService } from '@numberService';

describe('RecipeIngredientService', () => {
  let service: RecipeIngredientService;
  let recipeIngredientModalService: RecipeIngredientModalService;
  let uomService: UomService;
  let notificationService: NotificationService;
  let userIngredientService: UserIngredientService;
  let recipeHistoryService: RecipeHistoryService;
  let numberService: NumberService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({});
  }));

  beforeEach(() => {
    service = TestBed.inject(RecipeIngredientService);
    recipeIngredientModalService = TestBed.inject(RecipeIngredientModalService);
    uomService = TestBed.inject(UomService);
    notificationService = TestBed.inject(NotificationService);
    userIngredientService = TestBed.inject(UserIngredientService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
    numberService = TestBed.inject(NumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findRecipeIngredients', () => {
    it('should find all ingredients for a recipe', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'a' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'b' }), new Ingredient({ id: '3', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'c' })],
        }),
      ];

      const result = service.findRecipeIngredients(recipes[0], recipes, []);

      expect(result.length).toEqual(3);
    });

    it('should handle circularly dependent recipe ingredients', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'a' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'b' }), new Ingredient({ id: '3', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'c' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
      ];
      const ingredients = [new Ingredient({ id: 'b' })];

      const result = service.findRecipeIngredients(recipes[0], recipes, ingredients);

      expect(result.length).toEqual(3);
    });

    it('should handle optional recipe ingredients', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({ id: 'a' }),
            new Ingredient({ id: 'b' }),
            new Ingredient({ id: 'c', isOptional: true }),
            new Ingredient({ id: 'd', isOptional: true }),
            new Ingredient({ id: '2', uom: UOM.RECIPE }),
            new Ingredient({ id: '3', uom: UOM.RECIPE }),
          ],
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({ id: 'a' }),
            new Ingredient({ id: 'b', isOptional: true }),
            new Ingredient({ id: 'c' }),
            new Ingredient({ id: 'd', isOptional: true }),
          ],
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'd', isOptional: true })],
        }),
      ];

      const result = service.findRecipeIngredients(recipes[0], recipes, []);

      expect(result.length).toEqual(4);
    });
  });

  describe('findRecipeIds', () => {
    it('should find all recipe ingredients for a recipe', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'a' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'b' }), new Ingredient({ id: '3', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'c' })],
        }),
      ];

      const result = service.findRecipeIds(recipes[0], recipes);

      expect(result.length).toEqual(3);
      expect(result).toEqual(['2', '3', '1']);
    });

    it('should handle circularly dependent recipe ingredients', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'a' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'b' }), new Ingredient({ id: '3', uom: UOM.RECIPE })],
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [new Ingredient({ id: 'c' }), new Ingredient({ id: '2', uom: UOM.RECIPE })],
        }),
      ];

      const result = service.findRecipeIds(recipes[0], recipes);

      expect(result.length).toEqual(3);
      expect(result).toEqual(['2', '3', '1']);
    });
  });

  describe('getRecipeCalories', () => {
    it('should calculate calories for a recipe', () => {
      const recipe = new Recipe({
        id: 'id',
        servings: 2,
        ingredients: [
          {
            id: 'ingredient-1',
            uom: UOM.OTHER,
            quantity: 5,
          },
          {
            id: 'ingredient-2',
            uom: UOM.TABLESPOON,
            quantity: 10,
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredient-1',
          uom: UOM.OTHER,
          amount: 10,
          calories: 100,
        }),
        new Ingredient({
          id: 'ingredient-2',
          uom: UOM.FLUID_OUNCE,
          amount: 10,
          calories: 100,
        }),
      ];

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.callThrough();
      spyOn(uomService, 'convert').and.callThrough();

      const result = service.getRecipeCalories(recipe, [], ingredients);

      expect(result).toEqual(50);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle recipe without servings', () => {
      const recipe = new Recipe({
        id: 'id',
        ingredients: [],
      });

      const ingredients = [];

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.callThrough();
      spyOn(uomService, 'convert').and.callThrough();

      const result = service.getRecipeCalories(recipe, [], ingredients);

      expect(result).toEqual(0);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
    });

    it('should handle an ingredient without calories', () => {
      const recipe = new Recipe({
        id: 'id',
        servings: 2,
        ingredients: [
          {
            id: 'ingredient-1',
            uom: UOM.OTHER,
            quantity: 5,
          },
          {
            id: 'ingredient-2',
            uom: UOM.TABLESPOON,
            quantity: 10,
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredient-1',
          uom: UOM.OTHER,
          amount: 10,
          calories: 100,
        }),
        new Ingredient({
          id: 'ingredient-2',
          uom: UOM.FLUID_OUNCE,
          amount: 10,
        }),
      ];

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.callThrough();
      spyOn(uomService, 'convert').and.callThrough();

      const result = service.getRecipeCalories(recipe, [], ingredients);

      expect(result).toEqual(25);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle an invalid ingredient uom', () => {
      const recipe = new Recipe({
        id: 'id',
        servings: 2,
        ingredients: [
          {
            id: 'ingredient-1',
            uom: UOM.OTHER,
            quantity: 5,
          },
          {
            id: 'ingredient-2',
            uom: UOM.TABLESPOON,
            quantity: 10,
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredient-1',
          uom: UOM.OTHER,
          amount: 10,
          calories: 100,
        }),
        new Ingredient({
          id: 'ingredient-2',
          uom: UOM.OUNCE,
          amount: 10,
          calories: 100,
        }),
      ];

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.callThrough();
      spyOn(uomService, 'convert').and.callThrough();

      const result = service.getRecipeCalories(recipe, [], ingredients);

      expect(result).toEqual(25);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle an optional ingredient', () => {
      const recipe = new Recipe({
        id: 'id',
        servings: 2,
        ingredients: [
          {
            id: 'ingredient-1',
            uom: UOM.OTHER,
            quantity: 5,
          },
          {
            id: 'ingredient-2',
            uom: UOM.TABLESPOON,
            quantity: 10,
            isOptional: true,
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredient-1',
          uom: UOM.OTHER,
          amount: 10,
          calories: 100,
        }),
        new Ingredient({
          id: 'ingredient-2',
          uom: UOM.OUNCE,
          amount: 10,
          calories: 100,
        }),
      ];

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.callThrough();
      spyOn(uomService, 'convert').and.callThrough();

      const result = service.getRecipeCalories(recipe, [], ingredients);

      expect(result).toEqual(25);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add an ingredient to the cart', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [new Ingredient({})],
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], [], [new UserIngredient({})], '', '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 0,
        ingredients: [],
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], [], [new UserIngredient({})], '', '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid and call the callback', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 0,
        ingredients: [],
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], [], [new UserIngredient({})], '', '', () => {});

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('addIngredientsEvent', () => {
    it('should add an ingredient to the cart', () => {
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          uom: 'x',
          quantity: 10,
        }),
      ];

      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
          uom: 'y',
          amount: 2,
        }),
      ];

      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [
          {
            id: 'ingredientId',
            uom: 'x',
            quantity: 10,
          },
        ],
      });

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'update');
      spyOn(recipeHistoryService, 'add');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredients, '', '', recipe, [recipe]);

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalledTimes(1);
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should update recipe history', () => {
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          uom: 'x',
          quantity: 10,
        }),
      ];

      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
          uom: 'y',
          amount: 2,
        }),
      ];

      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [
          {
            id: 'ingredientId',
            uom: 'x',
            quantity: 10,
          },
          {
            id: 'id2',
            uom: UOM.RECIPE,
            quantity: 10,
          },
          {
            id: 'id3',
            uom: UOM.RECIPE,
            quantity: 10,
          },
        ],
      });

      const recipe2 = new Recipe({
        id: 'id2',
        ingredients: [
          {
            id: 'ingredientId2',
            uom: 'x',
            quantity: 10,
          },
          {
            id: 'id3',
            uom: UOM.RECIPE,
            quantity: 10,
          },
        ],
      });

      const recipe3 = new Recipe({
        id: 'id3',
        ingredients: [
          {
            id: 'ingredientId3',
            uom: 'x',
            quantity: 10,
          },
        ],
      });

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'update');
      spyOn(recipeHistoryService, 'add');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredients, '', 'uid', recipe, [
        recipe,
        recipe2,
        recipe3,
      ]);

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalledTimes(6);
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          uom: 'x',
          quantity: 10,
        }),
      ];

      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
        }),
      ];

      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomService, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'update');
      spyOn(recipeHistoryService, 'add');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredients, '', '');

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(recipeHistoryService.add).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should skip ingredients that are not available', () => {
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          uom: 'x',
          quantity: 10,
        }),
      ];

      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId2',
        }),
      ];

      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');
      spyOn(userIngredientService, 'update');
      spyOn(recipeHistoryService, 'add');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredients, '', '');

      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(recipeHistoryService.add).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
