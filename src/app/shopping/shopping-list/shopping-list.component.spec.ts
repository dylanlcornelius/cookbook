import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
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
import { TutorialService } from '@tutorialService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { NumberService } from '@numberService';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

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
  let tutorialService: TutorialService;
  let recipeIngredientService: RecipeIngredientService;
  let numberService: NumberService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatTableModule,
        FormsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [ ShoppingListComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userIngredientService = TestBed.inject(UserIngredientService);
    userItemService = TestBed.inject(UserItemService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
    validationService = TestBed.inject(ValidationService);
    tutorialService = TestBed.inject(TutorialService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
    numberService = TestBed.inject(NumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load ingredients and items', () => {
      const userIngredients = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({
        items: [{
          id: 'itemId'
        }]
      });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();
      fixture.detectChanges();
      component.ingredientControl.setValue(undefined);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });

    it('should not load unavailable ingredients and items', () => {
      const userIngredients = new UserIngredient({
        ingredients: [{
          id: 'ingredientId2'
        }]
      });
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({
        items: [{
          id: 'itemId2'
        }]
      });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });

    it('should handle empty user ingredients and user items', () => {
      const userIngredients = new UserIngredient({});
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userItemService, 'get').and.returnValue(of(userItems));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset filters', () => {
      component.ingredientsDataSource = new MatTableDataSource();

      component.applyFilter();

      expect(component.ingredientsDataSource.filter).toEqual('0');
    });
  });

  describe('removeIngredient', () => {
    it('should update user ingredients', () => {
      const ingredients = [new Ingredient({ id: 'id', cartQuantity: 10, amount: 5 }), new Ingredient({})];
      component.ingredients = ingredients;
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not update user ingredients', () => {
      const ingredients = [new Ingredient({ id: 'id', cartQuantity: 10 }), new Ingredient({})];
      component.ingredients = ingredients;
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id');

      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should update user ingredients', () => {
      const ingredient = new Ingredient({ id: 'id', amount: 5 });

      spyOn(numberService, 'toDecimal');
      spyOn(recipeIngredientService, 'addIngredientsEvent');
      spyOn(component.ingredientControl, 'reset');

      component.addIngredient(ingredient);

      expect(numberService.toDecimal).toHaveBeenCalled();
      expect(recipeIngredientService.addIngredientsEvent).toHaveBeenCalled();
      expect(component.ingredientControl.reset).toHaveBeenCalled();
    });
  });

  describe('addIngredientToPantry', () => {
    it('should buy an ingredient', () => {
      const ingredients = [new Ingredient({ id: 'id', cartQuantity: 10 }), new Ingredient({})];
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);

      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });

    it('should complete the shopping list', () => {
      const ingredients = [new Ingredient({ id: 'id', cartQuantity: 0 }), new Ingredient({})];
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);
      
      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });

    it('should buy an ingredient with an invalid cart quantity', () => {
      const ingredients = [new Ingredient({ id: 'id', cartQuantity: NaN }), new Ingredient({})];
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);
      component.applyFilter();
      
      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should update user items', () => {
      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(userItemService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem('item');

      expect(userItemService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(component.ingredientControl.reset).toHaveBeenCalled();
    });

    it('should not update user items given an empty string', () => {
      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(userItemService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem('    ');

      expect(userItemService.formattedUpdate).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
      expect(component.ingredientControl.reset).not.toHaveBeenCalled();
    });

    it('should not update user items given a blank item', () => {
      component.userItem = new UserItem({ items: [{ name: 'name'}] });
      
      spyOn(userItemService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(component.ingredientControl, 'reset');

      component.addItem(null);

      expect(userItemService.formattedUpdate).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
      expect(component.ingredientControl.reset).not.toHaveBeenCalled();
    });
  });

  describe('removeItem', () => {
    it('should buy a user item', () => {
      component.userItem = new UserItem({ items: [{ name: 'item'}, { name: 'item2' }] });
      component.ingredientsDataSource = new MatTableDataSource([]);

      spyOn(userItemService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');
      spyOn(userItemService, 'buyUserItem');

      component.removeItem(1);

      expect(userItemService.formattedUpdate).toHaveBeenCalled();
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
      const ingredients = [new Ingredient({ cartQuantity: 10 }), new Ingredient({})];
      component.userIngredient = new UserIngredient({ ingredients });
      component.ingredientsDataSource = new MatTableDataSource(ingredients);

      component.userItem = new UserItem({ items: [{ name: 'name'}] });

      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(userIngredientService, 'formattedUpdate');
      spyOn(userItemService, 'formattedUpdate');

      component.addAllToPantryEvent();

      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
      expect(userItemService.formattedUpdate).toHaveBeenCalled();
    });
  });

  describe('openTutorial', () => {
    it('should open the tutorial', () => {
      spyOn(tutorialService, 'openTutorial');

      component.openTutorial();

      expect(tutorialService.openTutorial).toHaveBeenCalled();
    });
  });
});
