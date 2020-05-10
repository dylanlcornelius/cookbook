import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppingListComponent } from './shopping-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { UserService } from '@userService';
import { of } from 'rxjs';
import { User } from 'src/app/user/shared/user.model';
import { UserIngredient } from '../shared/user-ingredient.model';
import { IngredientService } from '@ingredientService';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';
import { ItemService } from '@itemService';
import { UserItem } from '../shared/user-item.model';
import { Item } from 'src/app/item/shared/item.model';

describe('ShoppingListComponent', () => {
  let component: ShoppingListComponent;
  let fixture: ComponentFixture<ShoppingListComponent>;
  let userIngredientService: UserIngredientService;
  let userItemService: UserItemService;
  let userService: UserService;
  let ingredientService: IngredientService;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userIngredientService = TestBed.inject(UserIngredientService);
    userItemService = TestBed.inject(UserItemService);
    userService = TestBed.inject(UserService);
    ingredientService = TestBed.inject(IngredientService);
    itemService = TestBed.inject(ItemService);
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
      const items = [new Item({
        id: 'itemId'
      })];

      spyOn(userService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'getUserIngredients').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));
      spyOn(userItemService, 'getUserItems').and.returnValue(of(userItems));
      spyOn(itemService, 'getItems').and.returnValue(of(items));

      component.load();

      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.getUserIngredients).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
      expect(userItemService.getUserItems).toHaveBeenCalled();
      expect(itemService.getItems).toHaveBeenCalled();
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
      const items = [new Item({
        id: 'itemId'
      })];

      spyOn(userService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'getUserIngredients').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));
      spyOn(userItemService, 'getUserItems').and.returnValue(of(userItems));
      spyOn(itemService, 'getItems').and.returnValue(of(items));

      component.load();

      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.getUserIngredients).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
      expect(userItemService.getUserItems).toHaveBeenCalled();
      expect(itemService.getItems).toHaveBeenCalled();
    });

    it('should not load ingredients and items', () => {
      const userIngredients = new UserIngredient({});
      const ingredients = [new Ingredient({
        id: 'ingredientId'
      })];
      const userItems = new UserItem({});
      const items = [new Item({
        id: 'itemId'
      })];

      spyOn(userService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'getUserIngredients').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));
      spyOn(userItemService, 'getUserItems').and.returnValue(of(userItems));
      spyOn(itemService, 'getItems').and.returnValue(of(items));

      component.load();

      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.getUserIngredients).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
      expect(userItemService.getUserItems).toHaveBeenCalled();
      expect(itemService.getItems).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should reset filters', () => {
      component.ingredientsDataSource = new MatTableDataSource();
      component.itemsDataSource = new MatTableDataSource();

      component.applyFilter();

      expect(component.ingredientsDataSource.filter).toEqual('0');
      expect(component.itemsDataSource.filter).toEqual('0');
    });
  });

  describe('packageIngredientData', () => {
    it('should create a user ingredient object', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);

      const result = component.packageIngredientData();

      expect(result.ingredients[0].id).toEqual('id')
    });
  });

  describe('removeIngredient', () => {
    it('should update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.ingredients = [{id: 'id', amount: 5}]

      spyOn(component, 'packageIngredientData');
      spyOn(userIngredientService, 'putUserIngredient');

      component.removeIngredient('id');

      expect(component.packageIngredientData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });

    it('should not update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 1}]);
      component.ingredients = [{id: 'id'}]

      spyOn(component, 'packageIngredientData');
      spyOn(userIngredientService, 'putUserIngredient');

      component.removeIngredient('id');

      expect(component.packageIngredientData).not.toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.ingredients = [{id: 'id', amount: 5}]

      spyOn(component, 'packageIngredientData');
      spyOn(userIngredientService, 'putUserIngredient');

      component.addIngredient('id');

      expect(component.packageIngredientData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });

    it('should not update user ingredients', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.ingredients = [{id: 'id'}]

      spyOn(component, 'packageIngredientData');
      spyOn(userIngredientService, 'putUserIngredient');

      component.addIngredient('id');

      expect(component.packageIngredientData).not.toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).not.toHaveBeenCalled();
    });
  });

  describe('addIngredientToPantry', () => {
    it('should buy an ingredient', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
    });

    it('should complete the shopping list', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.ingredientsDataSource.filteredData = [];
      component.itemsDataSource = new MatTableDataSource([]);
      component.itemsDataSource.filteredData = [];

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(component.isCompleted).toBeTrue();
    });

    it('should not buy an ingredient', () => {
      component.ingredientsDataSource = new MatTableDataSource([{id: 'id'}]);
      component.itemsDataSource = new MatTableDataSource([]);

      spyOn(component, 'applyFilter');
      spyOn(userIngredientService, 'buyUserIngredient');

      component.addIngredientToPantry('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(1);
      expect(userIngredientService.buyUserIngredient).not.toHaveBeenCalled();
    });
  });

  describe('packageItemData', () => {
    it('should create a user item object', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id'}]);

      const result = component.packageItemData();

      expect(result.items[0].id).toEqual('id')
    });
  });

  describe('removeItem', () => {
    it('should update user items', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);

      spyOn(component, 'packageItemData');
      spyOn(userItemService, 'putUserItem');

      component.removeItem('id');

      expect(component.packageItemData).toHaveBeenCalled();
      expect(userItemService.putUserItem).toHaveBeenCalled();
    });

    it('should not update user items', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 0}]);

      spyOn(component, 'packageItemData');
      spyOn(userItemService, 'putUserItem');

      component.removeItem('id');

      expect(component.packageItemData).not.toHaveBeenCalled();
      expect(userItemService.putUserItem).not.toHaveBeenCalled();
    });
  });

  describe('addItem', () => {
    it('should update user items', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id'}]);

      spyOn(component, 'packageItemData');
      spyOn(userItemService, 'putUserItem');

      component.addItem('id');

      expect(component.packageItemData).toHaveBeenCalled();
      expect(userItemService.putUserItem).toHaveBeenCalled();
    });
  });

  describe('removeItemFromCart', () => {
    it('should buy a user item', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.ingredientsDataSource = new MatTableDataSource([]);
      
      spyOn(component, 'applyFilter');
      spyOn(userItemService, 'buyUserItem');

      component.removeItemFromCart('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userItemService.buyUserItem).toHaveBeenCalled();
    });

    it('should complete the shopping list', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id', cartQuantity: 10}]);
      component.itemsDataSource.filteredData = [];
      component.ingredientsDataSource = new MatTableDataSource([]);
      component.ingredientsDataSource.filteredData = [];
      
      spyOn(component, 'applyFilter');
      spyOn(userItemService, 'buyUserItem');

      component.removeItemFromCart('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(2);
      expect(userItemService.buyUserItem).toHaveBeenCalled();
      expect(component.isCompleted).toBeTrue();
    });

    it('should not buy a user item', () => {
      component.itemsDataSource = new MatTableDataSource([{id: 'id'}]);

      spyOn(component, 'applyFilter');
      spyOn(userItemService, 'buyUserItem');

      component.removeItemFromCart('id');

      expect(component.applyFilter).toHaveBeenCalledTimes(1);
      expect(userItemService.buyUserItem).not.toHaveBeenCalled();
    });
  });

  describe('addAllToPantry', () => {
    it('should open a modal to add all to pantry', () => {
      component.addAllToPantry();

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('addAllToPantryEvent', () => {
    it('should add ingredients and items to pantry', () => {
      component.ingredientsDataSource = new MatTableDataSource([{
        cartQuantity: 10
      }, {}]);

      component.itemsDataSource = new MatTableDataSource([{
        cartQuantity: 10
      }, {}]);

      spyOn(component, 'packageIngredientData');
      spyOn(userIngredientService, 'buyUserIngredient');
      spyOn(component, 'packageItemData');
      spyOn(userItemService, 'buyUserItem');
      spyOn(component, 'applyFilter');

      component.addAllToPantryEvent(component);

      expect(component.packageIngredientData).toHaveBeenCalled();
      expect(userIngredientService.buyUserIngredient).toHaveBeenCalled();
      expect(component.packageIngredientData).toHaveBeenCalled();
      expect(userItemService.buyUserItem).toHaveBeenCalled();
      expect(component.applyFilter).toHaveBeenCalled();
      expect(component.notificationModalParams).toBeDefined();
    });
  });
});
