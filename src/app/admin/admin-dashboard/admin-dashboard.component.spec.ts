import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '@configService';
import { UserService } from '@userService';
import { RecipeService } from '@recipeService';
import { IngredientService } from '@ingredientService';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { of } from 'rxjs';
import { Config } from '@config';
import { NotificationService, ValidationService } from '@modalService';
import { NavigationService } from '@navigationService';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let configService: ConfigService;
  let navigationService: NavigationService;
  let userService: UserService;
  let recipeService: RecipeService;
  let ingredientService: IngredientService;
  let userIngredientService: UserIngredientService;
  let userItemService: UserItemService;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatTableModule
      ],
      declarations: [ AdminDashboardComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.inject(ConfigService);
    navigationService = TestBed.inject(NavigationService);
    userService = TestBed.inject(UserService);
    recipeService = TestBed.inject(RecipeService);
    ingredientService = TestBed.inject(IngredientService);
    userIngredientService = TestBed.inject(UserIngredientService);
    userItemService = TestBed.inject(UserItemService);
    validationService = TestBed.inject(ValidationService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load every collection', () => {
      spyOn(configService, 'get').and.returnValue(of([]));
      spyOn(navigationService, 'get').and.returnValue(of([]));
      spyOn(userService, 'get').and.returnValue(of([]));
      spyOn(recipeService, 'get').and.returnValue(of([]));
      spyOn(ingredientService, 'get').and.returnValue(of([]));
      spyOn(userIngredientService, 'get').and.returnValue(of([]));
      spyOn(userItemService, 'get').and.returnValue(of([]));

      component.load();

      expect(configService.get).toHaveBeenCalled();
      expect(navigationService.get).toHaveBeenCalled();
      expect(userService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(userItemService.get).toHaveBeenCalled();
    });
  });

  describe('isArray', () => {
    it('should return true if an object is an array', () => {
      const result = component.isArray([]);

      expect(result).toBeTrue();
    });

    it('should return false if an object is not an array', () => {
      const result = component.isArray({});

      expect(result).toBeFalse();
    });
  });

  describe('addConfig', () => {
    it('should create a new config', () => {
      spyOn(configService, 'create');

      component.addConfig();

      expect(configService.create).toHaveBeenCalled();
    });
  });

  describe('removeConfig', () => {
    it('should delete a config with a name', () => {
      spyOn(validationService, 'setModal');

      component.removeConfig('id', 'name');

      expect(validationService.setModal).toHaveBeenCalled();
    });

    it('should delete a config without a name', () => {
      spyOn(validationService, 'setModal');
     
      component.removeConfig('id', undefined);
      
      expect(validationService.setModal).toHaveBeenCalled();
    });
  });
  
  describe('removeConfigEvent', () => {
    it('should delete a config', () => {
      spyOn(configService, 'delete');

      component.removeConfigEvent('id');

      expect(configService.delete).toHaveBeenCalled();
    });
  });

  describe('addNav', () => {
    it('should create a new navigation', () => {
      spyOn(navigationService, 'create');

      component.addNav();

      expect(navigationService.create).toHaveBeenCalled();
    });
  });

  describe('removeNav', () => {
    it('should delete a navigation without a name', () => {
      spyOn(validationService, 'setModal');
     
      component.removeNav('', '');

      expect(validationService.setModal).toHaveBeenCalled();
    });

    it('should handle a navigation deletion', () => {
      spyOn(validationService, 'setModal');
     
      component.removeNav('', 'name');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeNavEvent', () => {
    it('should create a new navigation', () => {
      spyOn(navigationService, 'delete');

      component.removeNavEvent('');

      expect(navigationService.delete).toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should remove a user with a first or last name', () => {
      spyOn(validationService, 'setModal');
     
      component.removeUser('id', undefined, 'last');

      expect(validationService.setModal).toHaveBeenCalled();
    });

    it('should remove a user without a first or last name', () => {
      spyOn(validationService, 'setModal');
     
      component.removeUser('id', undefined, undefined);

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeUserEvent', () => {
    it('should remove a user', () => {
      spyOn(userService, 'delete');

      component.removeUserEvent('id');

      expect(userService.delete).toHaveBeenCalled();
    });
  });

  describe('revert', () => {
    it('should revert all changes', () => {
      spyOn(validationService, 'setModal');
     
      component.revert();

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('revertEvent', () => {
    it('should revert all changes', () => {
      component.originalConfigs = [new Config({})];

      spyOn(notificationService, 'setModal');

      component.revertEvent();

      expect(notificationService.setModal).toHaveBeenCalled();
      expect(component.configContext.dataSource).toEqual(component.originalConfigs);
    });
  });

  describe('save', () => {
    it('should save all changes', () => {
      spyOn(validationService, 'setModal');
     
      component.save();

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('saveEvent', () => {
    it('should save all changes', () => {
      spyOn(configService, 'update');
      spyOn(navigationService, 'update');
      spyOn(userService, 'update');
      spyOn(recipeService, 'update');
      spyOn(ingredientService, 'update');
      spyOn(userIngredientService, 'update');
      spyOn(userItemService, 'update');
      spyOn(notificationService, 'setModal');

      component.saveEvent();

      expect(configService.update).toHaveBeenCalled();
      expect(navigationService.update).toHaveBeenCalled();
      expect(userService.update).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(userItemService.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
