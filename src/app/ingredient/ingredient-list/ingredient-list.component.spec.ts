import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientListComponent } from './ingredient-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { User } from 'src/app/user/shared/user.model';
import { of } from 'rxjs';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { Ingredient } from '../shared/ingredient.model';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { RouterModule } from '@angular/router';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let currentUserService: CurrentUserService;
  let userIngredientService: UserIngredientService;
  let ingredientService: IngredientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatTableModule,
      ],
      declarations: [ IngredientListComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    userIngredientService = TestBed.inject(UserIngredientService);
    ingredientService = TestBed.inject(IngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load ingredients', () => {
      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'id'
        }, {}]
      });
      const ingredients = [new Ingredient({
        id: 'id'
      })];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(userIngredientService, 'getUserIngredient').and.returnValue(of(userIngredient));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.getUserIngredient).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
    });
  });

  describe('applyFilter', () => {
    it('should apply a filter', () => {
      component.dataSource = new MatTableDataSource([]);

      component.applyFilter('filter');

      expect(component.dataSource.filter).toEqual('filter');
    });

    it('should apply a filter and go to the first page', () => {
      component.dataSource = {paginator: {firstPage: () => {}}};

      spyOn(component.dataSource.paginator, 'firstPage');

      component.applyFilter('filter');

      expect(component.dataSource.filter).toEqual('filter');
      expect(component.dataSource.paginator.firstPage).toHaveBeenCalled();
    });
  });

  describe('editIngredient', () => {
    it('should change a user ingredient', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id'}];
      component.userIngredients = [{id: 'id', cartQuantity: 1}];
      
      component.editIngredient('id');

      expect(component.ingredientModalParams).toBeDefined();
      expect(component.ingredientModalParams.data.cartQuantity).toEqual(1);
    });

    it('should not change a user ingredient if it does not exist', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id2'}];
      component.userIngredients = [{id: 'id'}];
      
      component.editIngredient('id2');

      expect(component.ingredientModalParams).toBeDefined();
      expect(component.ingredientModalParams.data.cartQuantity).toEqual(0);
    });
  });

  describe('editIngredientEvent', () => {
    it('should update a user ingredient', () => {
      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.editIngredientEvent(component);

      expect(component.packageData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });
  });

  describe('packageData', () => {
    it('should return a user ingredient object', () => {
      component.userIngredients = [new Ingredient({})];

      const result = component.packageData(component);

      expect(result).toBeDefined();
    });
  });

  describe('removeIngredient', () => {
    it('should remove a user ingredient', () => {
      component.userIngredients = [{id: 'id', cartQuantity: 1}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.removeIngredient('id');

      expect(component.packageData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });

    it('should not remove a user ingredient if it is zero', () => {
      component.userIngredients = [{id: 'id', cartQuantity: 1}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.removeIngredient('id2');

      expect(component.packageData).not.toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should add a user ingredient', () => {
      component.userIngredients = [{id: 'id'}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.addIngredient('id');

      expect(component.packageData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });

    it('should not add a user ingredient if there is no user ingredient', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.addIngredient('id');

      expect(component.packageData).toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).toHaveBeenCalled();
    });

    it('should handle an ingredient without an amount', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id'}];

      spyOn(component, 'packageData').and.returnValue(new UserIngredient({}));
      spyOn(userIngredientService, 'putUserIngredient');

      component.addIngredient('id');

      expect(component.packageData).not.toHaveBeenCalled();
      expect(userIngredientService.putUserIngredient).not.toHaveBeenCalled();
    });
  });
});
