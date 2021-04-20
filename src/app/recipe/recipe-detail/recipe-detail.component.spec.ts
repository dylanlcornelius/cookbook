import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule, Router } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecipeService } from '@recipeService';
import { Recipe } from '../shared/recipe.model';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { ImageService } from 'src/app/util/image.service';
import { of } from 'rxjs';
import { IngredientService } from '@ingredientService';
import { User } from 'src/app/user/shared/user.model';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { RecipeHistoryService } from '../shared/recipe-history.service';
import { RecipeHistory } from '../shared/recipe-history.model';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let currentUserService: CurrentUserService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;
  let recipeHistoryService: RecipeHistoryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'recipe/list', component: RecipeListComponent}
        ])
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load a recipe with an image', fakeAsync(() => {
      const user = new User({});
      const recipe = new Recipe({});
      const ingredients = [new Ingredient({})];
      const recipeHistories = new RecipeHistory({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'get').and.returnValue(of(recipe));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistories));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));
      spyOn(ingredientService, 'buildRecipeIngredients');

      component.load();
      
      tick();
      expect(component.recipeImage).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
    }));

    it('should load a recipe without an image', fakeAsync(() => {
      const user = new User({});
      const recipe = new Recipe({});
      const ingredients = [new Ingredient({})];
      const recipeHistories = new RecipeHistory({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'get').and.returnValue(of(recipe));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistories));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());
      spyOn(ingredientService, 'buildRecipeIngredients');

      component.load();
      
      tick();
      expect(component.recipeImage).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
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

  describe('onRate', () => {
    it('should call the recipe service and rate a recipe', () => {
      spyOn(recipeService, 'rateRecipe');

      component.onRate(1, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
    });
  });
});
