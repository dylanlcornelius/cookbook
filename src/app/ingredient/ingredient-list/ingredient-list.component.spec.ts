import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IngredientListComponent } from './ingredient-list.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatLegacyTableModule as MatTableModule, MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { User } from '@user';
import { of } from 'rxjs';
import { UserIngredient } from '@userIngredient';
import { Ingredient } from '@ingredient';
import { CurrentUserService } from '@currentUserService';
import { RouterModule } from '@angular/router';
import { HouseholdService } from '@householdService';
import { Household } from '@household';
import { TutorialService } from '@tutorialService';
import { NumberService } from '@numberService';
import { Config } from '@config';
import { ConfigService } from '@configService';

describe('IngredientListComponent', () => {
  let component: IngredientListComponent;
  let fixture: ComponentFixture<IngredientListComponent>;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let userIngredientService: UserIngredientService;
  let ingredientService: IngredientService;
  let numberService: NumberService;
  let tutorialService: TutorialService;
  let configService: ConfigService;

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
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    userIngredientService = TestBed.inject(UserIngredientService);
    ingredientService = TestBed.inject(IngredientService);
    numberService = TestBed.inject(NumberService);
    tutorialService = TestBed.inject(TutorialService);
    configService = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load ingredients', () => {
      const userIngredients = [new UserIngredient({ ingredientId: 'id'}), new UserIngredient({})];
      const ingredients = [new Ingredient({ id: 'id', category: 'BAKING' })];
      const configs = [new Config({ value: 'BAKING', displayValue: 'Baking' })];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(numberService, 'toFormattedFraction').and.returnValue('1/2');

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(numberService.toFormattedFraction).toHaveBeenCalled();
    });

    it('should load ingredients without data', () => {
      const userIngredients = [new UserIngredient({ ingredientId: 'id'}), new UserIngredient({})];
      const ingredients = [new Ingredient({ id: 'id'})];
      const configs = [new Config({ value: 'BAKING', displayValue: 'Baking' })];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(numberService, 'toFormattedFraction').and.returnValue('1/2');

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(numberService.toFormattedFraction).toHaveBeenCalled();
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
      component.userIngredients = [{ingredientId: 'id', cartQuantity: 1}];
      
      component.editIngredient('id');

      expect(component.ingredientModalParams).toBeDefined();
      expect(component.ingredientModalParams.data.cartQuantity).toEqual(1);
    });

    it('should not change a user ingredient if it does not exist', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id2'}];
      component.userIngredients = [{ingredientId: 'id'}];
      
      component.editIngredient('id2');

      expect(component.ingredientModalParams).toBeDefined();
      expect(component.ingredientModalParams.data.cartQuantity).toEqual(0);
    });
  });

  describe('editIngredientEvent', () => {
    it('should update a user ingredient', () => {
      spyOn(userIngredientService, 'update');

      component.editIngredientEvent();

      expect(userIngredientService.update).toHaveBeenCalled();
    });
  });

  describe('removeIngredient', () => {
    it('should remove a user ingredient', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id', cartQuantity: 1 })];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'update');

      component.removeIngredient('id');

      expect(userIngredientService.update).toHaveBeenCalled();
    });

    it('should not remove a user ingredient if it is zero', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id', cartQuantity: 1 })];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'update');

      component.removeIngredient('id2');

      expect(userIngredientService.update).not.toHaveBeenCalled();
    });
  });

  describe('addIngredient', () => {
    it('should add a user ingredient', () => {
      component.userIngredients = [new UserIngredient({ ingredientId: 'id' })];
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'update');

      component.addIngredient('id');

      expect(userIngredientService.update).toHaveBeenCalled();
    });

    it('should not add a user ingredient if there is no user ingredient', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id', amount: 1}];

      spyOn(userIngredientService, 'update');

      component.addIngredient('id');

      expect(userIngredientService.update).toHaveBeenCalled();
    });

    it('should handle an ingredient without an amount', () => {
      component.dataSource = new MatTableDataSource([]);
      component.dataSource.data = [{id: 'id'}];

      spyOn(userIngredientService, 'update');

      component.addIngredient('id');

      expect(userIngredientService.update).not.toHaveBeenCalled();
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
