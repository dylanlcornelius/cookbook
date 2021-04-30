import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IngredientListComponent } from './ingredient-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { User } from '@user';
import { of } from 'rxjs';
import { UserIngredient } from '@userIngredient';
import { Ingredient } from '@ingredient';
import { CurrentUserService } from '@currentUserService';
import { RouterModule } from '@angular/router';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let currentUserService: CurrentUserService;
  let userIngredientService: UserIngredientService;
  let ingredientService: IngredientService;

  beforeEach(waitForAsync(() => {
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
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
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
      spyOn(userIngredientService, 'formattedUpdate');

      component.editIngredientEvent(component);

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });
  });

  describe('removeIngredient', () => {
    it('should remove a user ingredient', () => {
      component.userIngredients = [{id: 'id', cartQuantity: 1}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not remove a user ingredient if it is zero', () => {
      component.userIngredients = [{id: 'id', cartQuantity: 1}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'formattedUpdate');

      component.removeIngredient('id2');

      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should add a user ingredient', () => {
      component.userIngredients = [{id: 'id'}];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'formattedUpdate');

      component.addIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not add a user ingredient if there is no user ingredient', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'formattedUpdate');

      component.addIngredient('id');

      expect(userIngredientService.formattedUpdate).toHaveBeenCalled();
    });

    it('should handle an ingredient without an amount', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id'}];

      spyOn(userIngredientService, 'formattedUpdate');

      component.addIngredient('id');

      expect(userIngredientService.formattedUpdate).not.toHaveBeenCalled();
    });
  });
});
