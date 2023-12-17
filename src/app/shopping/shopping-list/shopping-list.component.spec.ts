import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { of } from 'rxjs';
import { User } from '@user';
import { UserIngredient } from '@userIngredient';
import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';
import { UserItem } from '@userItem';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { HouseholdService } from '@householdService';
import { Household } from '@household';
import { RouterModule } from '@angular/router';
import { RecipeIngredientService } from '@recipeIngredientService';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { ConfigService } from '@configService';
import { Config } from '@config';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let userIngredientService: UserIngredientService;
  let userItemService: UserItemService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;
  let validationService: ValidationService;
  let recipeIngredientService: RecipeIngredientService;
  let configService: ConfigService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, MatAutocompleteModule],
      declarations: [ShoppingListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    userIngredientService = TestBed.inject(UserIngredientService);
    userItemService = TestBed.inject(UserItemService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
    validationService = TestBed.inject(ValidationService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
    configService = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load ingredients and items', () => {
      const userIngredients = [
        new UserIngredient({ ingredientId: 'ingredientId', cartQuantity: 1 }),
        new UserIngredient({ ingredientId: 'ingredientId2', cartQuantity: 2 }),
        new UserIngredient({ ingredientId: 'ingredientId3', cartQuantity: 2 }),
      ];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          category: 'BAKING',
        }),
        new Ingredient({
          id: 'ingredientId2',
          category: 'FAKE_CATEGORY',
        }),
        new Ingredient({
          id: 'ingredientId3',
          category: 'CANNED',
        }),
      ];
      const userItems = [new UserItem({ id: 'itemId' })];
      const configs = [
        new Config({ value: 'BAKING', displayValue: 'Baking' }),
        new Config({ value: 'CANNED', displayValue: 'Canned' }),
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));
      spyOn(configService, 'get').and.returnValue(of(configs));

      component.load();
      fixture.detectChanges();
      component.ingredientControl.setValue(undefined);

      expect(component.displayIngredients).toBeDefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });

    it('should not load unavailable ingredients and items', () => {
      const userIngredients = [new UserIngredient({ ingredientId: 'ingredientId2' })];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
        }),
      ];
      const userItems = [new UserItem({ id: 'itemId2' })];
      const configs = [];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));
      spyOn(configService, 'get').and.returnValue(of(configs));

      component.load();

      expect(component.displayIngredients).toBeDefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });

    it('should handle empty user ingredients and user items', () => {
      const userIngredients = [new UserIngredient({})];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
        }),
      ];
      const userItems = [];
      const configs = [];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));
      spyOn(configService, 'get').and.returnValue(of(configs));

      component.load();

      expect(component.displayIngredients).toBeNull();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should update user ingredients', () => {
      component.user = new User({});
      const ingredient = new Ingredient({ id: 'id', amount: '5' });

      spyOn(recipeIngredientService, 'addIngredientsEvent');
      spyOn(component.ingredientControl, 'reset');

      component.addIngredient(ingredient);

      expect(recipeIngredientService.addIngredientsEvent).toHaveBeenCalled();
      expect(component.ingredientControl.reset).toHaveBeenCalled();
    });
  });

  describe('addIngredientToPantry', () => {
    it('should buy an ingredient', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id', cartQuantity: 10 })];
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userIngredientService, 'delete');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(userIngredientService.delete).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });

    it('should complete the shopping list', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id', cartQuantity: 0 })];
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userIngredientService, 'delete');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(userIngredientService.delete).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });

    it('should buy an ingredient with an invalid cart quantity', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id', cartQuantity: NaN })];
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userIngredientService, 'delete');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(userIngredientService.delete).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should update user items', () => {
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userItemService, 'create');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem('item');

      expect(userItemService.create).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(component.ingredientControl.reset).toHaveBeenCalled();
    });

    it('should not update user items given an empty string', () => {
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userItemService, 'create');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem('    ');

      expect(userItemService.create).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
      expect(component.ingredientControl.reset).not.toHaveBeenCalled();
    });

    it('should not update user items given a blank item', () => {
      component.userItems = [new UserItem({ name: 'name' })];

      spyOn(userItemService, 'create');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem(null);

      expect(userItemService.create).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
      expect(component.ingredientControl.reset).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should buy a user item', () => {
      component.userIngredients = [];
      component.userItems = [
        new UserItem({ id: '1', name: 'item' }),
        new UserItem({ id: '2', name: 'item2' }),
      ];

      spyOn(userItemService, 'delete');
      spyOn(notificationService, 'setModal');
      spyOn(userItemService, 'buyUserItem');

      component.removeItem('2');

      expect(userItemService.delete).toHaveBeenCalled();
      expect(notificationService.setModal);
      expect(userItemService.buyUserItem).toHaveBeenCalled();
    });
  });

  describe('addAllToPantry', () => {
    it('should open a modal to add all to pantry', () => {
      spyOn(validationService, 'setModal');

      component.addAllToPantry();

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('addAllToPantryEvent', () => {
    it('should add ingredients and items to pantry', () => {
      component.userIngredients = [
        new UserIngredient({ cartQuantity: 10 }),
        new UserIngredient({ cartQuantity: 0 }),
      ];
      component.userItems = [new UserItem({ name: 'name' }), new UserItem({ name: 'name2' })];

      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(userIngredientService, 'delete');
      spyOn(userItemService, 'delete');

      component.addAllToPantryEvent();

      expect(userIngredientService.buyUserIngredient).toHaveBeenCalledWith(4, true);
      expect(userIngredientService.delete).toHaveBeenCalledTimes(2);
      expect(userItemService.delete).toHaveBeenCalledTimes(2);
    });
  });
});
