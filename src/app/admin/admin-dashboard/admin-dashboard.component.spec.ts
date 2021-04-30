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
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
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

      component.addConfig(component);

      expect(configService.create).toHaveBeenCalled();
    });
  });

  describe('removeConfig', () => {
    it('should delete a config with a name', () => {
      component.removeConfig(component, 'id', 'name');

      expect(component.validationModalParams).toBeDefined();
    });

    it('should delete a config without a name', () => {
      component.removeConfig(component, 'id', undefined);
      
      expect(component.validationModalParams).toBeDefined();
    });
  });
  
  describe('removeConfigEvent', () => {
    it('should delete a config', () => {
      spyOn(configService, 'delete');

      component.removeConfigEvent(component, 'id');

      expect(configService.delete).toHaveBeenCalled();
    });
  });

  describe('addNav', () => {
    it('should create a new navigation', () => {
      spyOn(navigationService, 'create');

      component.addNav(component);

      expect(navigationService.create).toHaveBeenCalled();
    });
  });

  describe('removeNav', () => {
    it('should delete a navigation without a name', () => {
      component.removeNav(component, '', '');

      expect(component.validationModalParams).toBeDefined();
    });

    it('should handle a navigation deletion', () => {
      component.removeNav(component, '', 'name');

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('removeNavEvent', () => {
    it('should create a new navigation', () => {
      spyOn(navigationService, 'delete');

      component.removeNavEvent(component, '');

      expect(navigationService.delete).toHaveBeenCalled();
    });
  });

  describe('removeUser', () => {
    it('should remove a user with a first or last name', () => {
      component.removeUser(component, 'id', undefined, 'last');

      expect(component.validationModalParams).toBeDefined();
    });

    it('should remove a user without a first or last name', () => {
      component.removeUser(component, 'id', undefined, undefined);

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('removeUserEvent', () => {
    it('should remove a user', () => {
      spyOn(userService, 'delete');

      component.removeUserEvent(component, 'id');

      expect(userService.delete).toHaveBeenCalled();
    });
  });

  describe('revert', () => {
    it('should revert all changes', () => {
      component.revert();

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('revertEvent', () => {
    it('should revert all changes', () => {
      component.originalConfigs = [new Config({})];

      spyOn(notificationService, 'setNotification');

      component.revertEvent(component);

      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(component.configContext.dataSource).toEqual(component.originalConfigs);
    });
  });

  describe('save', () => {
    it('should save all changes', () => {
      component.save();

      expect(component.validationModalParams).toBeDefined();
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
      spyOn(notificationService, 'setNotification');

      component.saveEvent(component);

      expect(configService.update).toHaveBeenCalled();
      expect(navigationService.update).toHaveBeenCalled();
      expect(userService.update).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalled();
      expect(ingredientService.update).toHaveBeenCalled();
      expect(userIngredientService.update).toHaveBeenCalled();
      expect(userItemService.update).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });
  });
});
