import { TestBed, waitForAsync } from '@angular/core/testing';
import { NotificationService } from '@notificationService';
import { Recipe } from '@recipe';
import { RecipeHistoryService } from '@recipeHistoryService';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { UOMConversion } from '@UOMConverson';

import { RecipeIngredientService } from '@recipeIngredientService';
import { NumberService } from 'src/app/util/number.service';
import { Ingredient } from '@ingredient';

describe('RecipeIngredientService', () => {
  let service: RecipeIngredientService;
  let uomConversion: UOMConversion;
  let notificationService: NotificationService;
  let userIngredientService: UserIngredientService;
  let recipeHistoryService: RecipeHistoryService;
  let numberService: NumberService;

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
    numberService = TestBed.inject(NumberService);
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(2);
      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomConversion, 'convert').and.returnValue(false);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal');
      spyOn(uomConversion, 'convert');

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(numberService.toDecimal).not.toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(2);
      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal');
      spyOn(uomConversion, 'convert');

      const result = service.getRecipeCount(recipe, userIngredient);

      expect(result).toEqual(0);
      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add an ingredient to the cart', () => {
      const recipe = new Recipe({
        id: 'id',
        count: 1,
        ingredients: [new Ingredient({})]
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
  });

  describe('addIngredientsEvent', () => {
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
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
      
      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
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
      
      spyOn(numberService, 'toDecimal');
      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');

      service.addIngredientsEvent(service, ingredients, userIngredient, '');

      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(10);
      spyOn(uomConversion, 'convert').and.returnValue(5);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal').and.returnValue(null);
      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(numberService.toDecimal).toHaveBeenCalled();
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

      spyOn(numberService, 'toDecimal');
      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });

    it('should do nothing if recipe count if NaN', () => {
      const recipe = new Recipe({id: 'id'});
      const userIngredient = new UserIngredient({});

      spyOn(numberService, 'toDecimal');
      spyOn(uomConversion, 'convert');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setNotification');
      spyOn(recipeHistoryService, 'add');

      service.removeIngredients(recipe, userIngredient, '');

      expect(numberService.toDecimal).not.toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(recipeHistoryService.add).toHaveBeenCalled();
    });
  });
});
