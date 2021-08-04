import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecipeService } from '@recipeService';
import { Recipe } from '@recipe';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { ImageService } from '@imageService';
import { of } from 'rxjs';
import { IngredientService } from '@ingredientService';
import { User } from '@user';
import { Ingredient } from '@ingredient';
import { CurrentUserService } from '@currentUserService';
import { NotificationService } from '@notificationService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { RecipeHistory } from '@recipeHistory';
import { UtilService } from '@utilService';
import { UOMConversion } from '@UOMConverson';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { RecipeIngredientService } from '@recipeIngredientService';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let currentUserService: CurrentUserService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;
  let recipeHistoryService: RecipeHistoryService;
  let utilService: UtilService;
  let userIngredientService: UserIngredientService;
  let recipeIngredientService: RecipeIngredientService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'recipe/list', component: RecipeListComponent }
        ])
      ],
      providers: [
        UOMConversion,
      ],
      declarations: [ RecipeDetailComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    recipeService = TestBed.inject(RecipeService);
    imageService = TestBed.inject(ImageService);
    currentUserService = TestBed.inject(CurrentUserService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
    utilService = TestBed.inject(UtilService);
    userIngredientService = TestBed.inject(UserIngredientService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {id: 'testId'};
    });

    it('should load a recipe with an image', fakeAsync(() => {
      const user = new User({});
      const recipes = [
        new Recipe({
          ingredients: [
            { id: 'ingredient' },
            { id: 'ingredient3' }
          ]
        })
      ];
      const ingredients = [new Ingredient({id: 'ingredient'})];
      const userIngredient = new UserIngredient({
        ingredients: [
          { id: 'ingredient' },
          { id: 'ingredient2' }
        ]
      });
      const recipeHistories = new RecipeHistory({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'get').withArgs('testId').and.returnValue(of(recipes[0])).withArgs().and.returnValue(of(recipes));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistories));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));
      spyOn(ingredientService, 'buildRecipeIngredients');
      spyOn(recipeIngredientService, 'getRecipeCount').and.returnValue(0);

      component.load();
      
      tick();
      expect(component.recipeImage).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
    }));

    it('should load a recipe without an image', fakeAsync(() => {
      const user = new User({});
      const recipe = new Recipe({ creationDate: { toDate: () => {} } });
      const ingredients = [new Ingredient({})];
      const userIngredient = new UserIngredient({});
      const recipeHistories = new RecipeHistory({ lastDateCooked: '17/5/2021' });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'get').withArgs('testId').and.returnValue(of(recipe)).withArgs().and.returnValue(of([]));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistories));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());
      spyOn(ingredientService, 'buildRecipeIngredients');
      spyOn(recipeIngredientService, 'getRecipeCount').and.returnValue(0);

      component.load();
      
      tick();
      expect(component.recipeImage).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
    }));

    it('should handle image errors', fakeAsync(() => {
      const user = new User({});
      const recipe = new Recipe({});
      const ingredients = [new Ingredient({})];
      const userIngredient = new UserIngredient({});
      const recipeHistories = new RecipeHistory({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'get').withArgs('testId').and.returnValue(of(recipe)).withArgs().and.returnValue(of([]));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistories));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());
      spyOn(ingredientService, 'buildRecipeIngredients');
      spyOn(recipeIngredientService, 'getRecipeCount').and.returnValue(0);

      component.load();
      
      tick();
      expect(component.recipeImage).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
    }));
  });

  describe('readFile', () => {
    it('should not upload a blank url', () => {
      spyOn(imageService, 'upload');
      spyOn(recipeService, 'update');

      component.readFile({});

      expect(imageService.upload).not.toHaveBeenCalled();
      expect(recipeService.update).not.toHaveBeenCalled();
      expect(component.recipeImage).toBeUndefined();
      expect(component.recipeImageProgress).toBeUndefined();
    });

    it('should upload a file and return progress', () => {
      component.recipe = new Recipe({});

      spyOn(imageService, 'upload').and.returnValue(of(1));
      spyOn(recipeService, 'update');

      component.readFile({target: {files: [{}]}});

      expect(imageService.upload).toHaveBeenCalled();
      expect(recipeService.update).not.toHaveBeenCalled();
      expect(component.recipeImage).toBeUndefined();
      expect(component.recipeImageProgress).toEqual(1);
    });

    it('should upload a file and return a file', () => {
      component.recipe = new Recipe({});

      spyOn(imageService, 'upload').and.returnValue(of('url'));
      spyOn(recipeService, 'update');
      spyOn(notificationService, 'setNotification');

      component.readFile({target: {files: [{}]}});

      expect(imageService.upload).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(component.recipeImage).toEqual('url');
      expect(component.recipeImageProgress).toBeUndefined();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', fakeAsync(() => {
      component.recipe = new Recipe({});
      component.recipeImage = 'url';

      spyOn(imageService, 'deleteFile').and.returnValue(Promise.resolve());
      spyOn(recipeService, 'update');

      component.deleteFile('url');

      tick();
      expect(imageService.deleteFile).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalled();
    }));
  });

  describe('deleteRecipe', () => {
    it('should open a modal to delete a recipe', () => {
      component.recipe = new Recipe({});

      component.deleteRecipe('id');

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('deleteRecipeEvent', () => {
    it('should not attempt to delete a recipe without an id', () => {
      spyOn(recipeService, 'delete');
      spyOn(component, 'deleteFile');
      spyOn(notificationService, 'setNotification');

      component.deleteRecipeEvent(component, '');

      expect(recipeService.delete).not.toHaveBeenCalled();
      expect(component.deleteFile).not.toHaveBeenCalled();
      expect(notificationService.setNotification).not.toHaveBeenCalled();
    });

    it('should delete a recipe', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(recipeService, 'delete');
      spyOn(component, 'deleteFile');
      spyOn(notificationService, 'setNotification');

      component.deleteRecipeEvent(component, 'id');

      expect(recipeService.delete).toHaveBeenCalled();
      expect(component.deleteFile).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('setCategoryFilter', () => {
    it('should set a category filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setCategoryFilter('filter');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('setAuthorFilter', () => {
    it('should set an author filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setAuthorFilter('filter');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients', () => {
      spyOn(recipeIngredientService, 'addIngredients');

      component.addIngredients();

      expect(recipeIngredientService.addIngredients).toHaveBeenCalled();
    });
  });

  describe('removeIngredients', () => {
    it('should remove ingredients', () => {
      spyOn(recipeIngredientService, 'removeIngredients');
  
      component.removeIngredients();
  
      expect(recipeIngredientService.removeIngredients).toHaveBeenCalled();
    });
  });

  describe('onRate', () => {
    it('should call the recipe service and rate a recipe', () => {
      spyOn(recipeService, 'rateRecipe');

      component.onRate(1, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
    });
  });

  describe('updateTimesCooked', () => {
    it('should open a modal to update recipe history', () => {
      component.user = new User({});

      component.updateTimesCooked(new Recipe({}));

      expect(component.recipeHistoryModalParams).toBeDefined();
    });
  });

  describe('updateRecipeHistoryEvent', () => {
    it('should delete a recipe', () => {
      spyOn(recipeHistoryService, 'set');
      spyOn(notificationService, 'setNotification');

      component.updateRecipeHistoryEvent(component, 'id', 'uid', 10);

      expect(recipeHistoryService.set).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });
  });
});
