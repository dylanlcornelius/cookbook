import { TestBed, waitForAsync } from '@angular/core/testing';
import { NotificationService } from '@notificationService';
import { Recipe } from '@recipe';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { UOMConversion } from '@UOMConverson';

import { RecipeIngredientService } from '@recipeIngredientService';

describe('RecipeIngredientService', () => {
  let service: RecipeIngredientService;
  let uomConversion: UOMConversion;
  let notificationService: NotificationService;
  let userIngredientService: UserIngredientService;
  let recipeHistoryService: RecipeHistoryService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        UOMConversion
      ]
    });
  }));

  beforeEach(() => {
    service = TestBed.inject(RecipeIngredientService);
    uomConversion = TestBed.inject(UOMConversion);
    notificationService = TestBed.inject(NotificationService);
    userIngredientService = TestBed.inject(UserIngredientService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(2);
      expect(uomConversion.convert).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(uomConversion.convert).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert').and.returnValue(false);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(uomConversion.convert).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert');

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(uomConversion.convert).not.toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(2);
      expect(uomConversion.convert).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert');

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(uomConversion.convert).not.toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add an ingredient to the cart', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [{}]
      });

      spyOn(service, 'setModal');
      spyOn(notificationService, 'setNotification');

      service.addIngredients(recipe, new UserIngredient({}), '');

      expect(service.setModal).toHaveBeenCalled();
      expect(notificationService.setNotification).not.toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 0,
        ingredients: []
      });
      
      spyOn(service, 'setModal');
      spyOn(notificationService, 'setNotification');

      service.addIngredients(recipe, new UserIngredient({}), '');

      expect(service.setModal).not.toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });

    it('should do nothing if recipe count is NaN', () => {
      const recipe = new Recipe({
        id: 'id',
        ingredients: [{}]
      });
      recipe.count = NaN;

      spyOn(service, 'setModal');
      spyOn(notificationService, 'setNotification');

      service.addIngredients(recipe, new UserIngredient({}), '');

      expect(service.setModal).not.toHaveBeenCalled();
      expect(notificationService.setNotification).not.toHaveBeenCalled();
    });
  });

  describe('addIngredientsEvent', () => {
    beforeEach(() => {
      const recipe = new Recipe({
        id: 'id',
        count: 0
      });
    });

    it('should add an ingredient to the cart', () => {
      const ingredients = [{
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      }];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId',
          uom: 'y',
          amount: 2
        }]
      });

      spyOn(uomConversion, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(uomConversion.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });

    it('should show an error if the uom conversion is invalid', () => {
       const ingredients =  [{
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      }];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });
      
      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(uomConversion.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });

    it('should skip ingredients that are not available', () => {
      const ingredients = [{
        id: 'ingredientId',
        uom: 'x',
        quantity: 10
      }];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2'
        }]
      });
      
      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });
  });

  describe('removeIngredients', () => {
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

      spyOn(uomConversion, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(uomConversion.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(uomConversion.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
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

      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });

    it('should do nothing if recipe count if NaN', () => {
      const recipe = new Recipe({id: 'id'});
      const userIngredient = new UserIngredient({});

      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });
  });
});
