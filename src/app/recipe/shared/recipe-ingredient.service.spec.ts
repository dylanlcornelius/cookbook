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
          ingredients: [
            new Ingredient({id: 'a'}),
            new Ingredient({id: '2', uom: UOM.RECIPE})
          ]
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({id: 'b'}),
            new Ingredient({id: '3', uom: UOM.RECIPE})
          ]
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({id: 'c'})
          ]
        })
      ];

      const result = service.findRecipeIngredients(recipes[0], recipes);

      expect(result.length).toEqual(3);
    });

    it('should handle circularly dependent recipe ingredients', () => {
      const recipes = [
        new Recipe({
          id: '1',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({id: 'a'}),
            new Ingredient({id: '2', uom: UOM.RECIPE})
          ]
        }),
        new Recipe({
          id: '2',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({id: 'b'}),
            new Ingredient({id: '3', uom: UOM.RECIPE})
          ]
        }),
        new Recipe({
          id: '3',
          uom: UOM.RECIPE,
          ingredients: [
            new Ingredient({id: 'c'}),
            new Ingredient({id: '2', uom: UOM.RECIPE})
          ]
        })
      ];

      const result = service.findRecipeIngredients(recipes[0], recipes);

      expect(result.length).toEqual(3);
    });
  });

  describe('getRecipeCount', () => {
    it('should count the available number of recipes', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2,
          pantryQuantity: 10
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(2);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle duplicate ingredients', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2,
          pantryQuantity: 10
        },
        {
          id: 'ingredientId',
          uom: 'y',
          amount: 2,
          pantryQuantity: 10
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(0);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle an invalid uom conversion', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2,
          pantryQuantity: 10
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomService, 'convert').and.returnValue(false);

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(0);
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should skip unavailble ingredients', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(0);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
    });

    it('should skip deleted ingredients', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10,
          name: null
        },
        {
          id: 'ingredientId2',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2',
          uom: 'y',
          amount: 2,
          pantryQuantity: 10
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(2);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
    });

    it('should handle no user ingredients', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: []
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');

      const result = service.getRecipeCount(recipe, [], userIngredient);

      expect(result).toEqual(0);
      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add an ingredient to the cart', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [new Ingredient({})]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], new UserIngredient({}), '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 0,
        ingredients: []
      });
      
      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], new UserIngredient({}), '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
    
    it('should show an error if the uom conversion is invalid and call the callback', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 0,
        ingredients: []
      });
      
      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(recipeIngredientModalService, 'setModal');
      spyOn(notificationService, 'setModal');

      service.addIngredients(recipe, [], new UserIngredient({}), '', () => {});

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientModalService.setModal).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('addIngredientsEvent', () => {
    it('should add an ingredient to the cart', () => {
      const ingredients = [new Ingredient({
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      })];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
       const ingredients =  [new Ingredient({
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      })];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });
      
      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomService, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should skip ingredients that are not available', () => {
      const ingredients = [new Ingredient({
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      })];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2'
        }]
      });
      
      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      service.addIngredientsEvent(ingredients, userIngredient, '');

      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeIngredients', () => {
    it('should reset pantry quantity to zero', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2,
          pantryQuantity: NaN
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, [], userIngredient, 'uid', 'householdId');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalledTimes(1);
      expect(recipeHistoryService.add).toHaveBeenCalledTimes(2);
    });

    it('should remove an ingredient from the pantry', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomService, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, [], userIngredient, 'uid', 'uid');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalledTimes(1);
      expect(recipeHistoryService.add).toHaveBeenCalledTimes(1);
    });

    it('should show an error if the uom conversion is invalid', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomService, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, [], userIngredient, 'uid', 'uid');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalledTimes(2);
      expect(recipeHistoryService.add).toHaveBeenCalledTimes(1);
    });

    it('should handle recipes without ingredients', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{
          id: 'ingredientId',
          uom: 'x',
          quantity: 10
        }]
      });

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, [], userIngredient, '', '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });

    it('should do nothing if recipe count if NaN', () => {
      const recipe = new Recipe({id: 'id'});
      const userIngredient = new UserIngredient({});

      spyOn(service, 'findRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(numberService, 'toDecimal');
      spyOn(uomService, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, [], userIngredient, '', '');

      expect(service.findRecipeIngredients).toHaveBeenCalled();
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });
  });
});
