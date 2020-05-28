import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecipeService } from '@recipeService';
import { Recipe } from '../shared/recipe.model';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { ImageService } from 'src/app/util/image.service';
import { of } from 'rxjs';
import { UserService } from '@userService';
import { IngredientService } from '@ingredientService';
import { User } from 'src/app/user/shared/user.model';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let userService: UserService;
  let ingredientService: IngredientService;

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
    recipeService = TestBed.get(RecipeService);
    imageService = TestBed.get(ImageService);
    userService = TestBed.get(UserService);
    ingredientService = TestBed.get(IngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load a recipe with an image', () => {
      const user = new User({});
      const recipe = new Recipe({});
      const ingredients = [new Ingredient({})];

      spyOn(userService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'getRecipe').and.returnValue(of(recipe));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));
      spyOn(imageService, 'downloadFile').and.returnValue(Promise.resolve('url'));
      spyOn(ingredientService, 'buildRecipeIngredients');

      component.load();
      
      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.getRecipe).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
      expect(imageService.downloadFile).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
    });

    it('should load a recipe with an image', () => {
      const user = new User({});
      const recipe = new Recipe({});
      const ingredients = [new Ingredient({})];

      spyOn(userService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(recipeService, 'getRecipe').and.returnValue(of(recipe));
      spyOn(ingredientService, 'getIngredients').and.returnValue(of(ingredients));
      spyOn(imageService, 'downloadFile').and.returnValue(Promise.resolve());
      spyOn(ingredientService, 'buildRecipeIngredients');

      component.load();
      
      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.getRecipe).toHaveBeenCalled();
      expect(ingredientService.getIngredients).toHaveBeenCalled();
      expect(imageService.downloadFile).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();

    });
  });

  describe('readFile', () => {
    it('should not upload a blank url', () => {
      spyOn(imageService, 'uploadFile');

      component.readFile({});

      expect(imageService.uploadFile).not.toHaveBeenCalled();
      expect(component.recipeImage).toBeUndefined();
      expect(component.recipeImageProgress).toBeUndefined();
    });

    it('should upload a file and return progress', () => {
      component.recipe = new Recipe({});

      spyOn(imageService, 'uploadFile').and.returnValue(of(1));

      component.readFile({target: {files: [{}]}});

      expect(imageService.uploadFile).toHaveBeenCalled();
      expect(component.recipeImage).toBeUndefined();
      expect(component.recipeImageProgress).toEqual(1);
    });

    it('should upload a file and return a', () => {
      component.recipe = new Recipe({});

      spyOn(imageService, 'uploadFile').and.returnValue(of('url'));

      component.readFile({target: {files: [{}]}});

      expect(imageService.uploadFile).toHaveBeenCalled();
      expect(component.recipeImage).toEqual('url');
      expect(component.recipeImageProgress).toBeUndefined();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', () => {
      component.recipeImage = 'url';
      spyOn(imageService, 'deleteFile').and.returnValue(Promise.resolve());

      component.deleteFile('url');

      expect(imageService.deleteFile).toHaveBeenCalled();
    });
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
      spyOn(recipeService, 'deleteRecipe');
      spyOn(component, 'deleteFile');

      component.deleteRecipeEvent(component, '');

      expect(recipeService.deleteRecipe).not.toHaveBeenCalled();
      expect(component.deleteFile).not.toHaveBeenCalled();
      expect(component.notificationModalParams).not.toBeDefined();
    });

    it('should delete a recipe recipe', () => {
      spyOn(recipeService, 'deleteRecipe');
      spyOn(component, 'deleteFile');

      component.deleteRecipeEvent(component, 'id');

      expect(recipeService.deleteRecipe).toHaveBeenCalled();
      expect(component.deleteFile).toHaveBeenCalled();
      expect(component.notificationModalParams).toBeDefined();
    });
  });

  describe('setListFilter', () => {
    it('should ', () => {
      component.setListFilter('filter');

      expect(recipeService.selectedFilters).toEqual(['filter']);
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
