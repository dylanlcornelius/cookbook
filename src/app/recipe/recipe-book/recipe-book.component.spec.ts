import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { Household } from '@household';
import { HouseholdService } from '@householdService';
import { ImageService } from '@imageService';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { RecipeService } from '@recipeService';
import { User } from '@user';
import { UtilService } from '@utilService';
import { of } from 'rxjs';
import { RecipeBookComponent } from './recipe-book.component';

describe('RecipeBookComponent', () => {
  let component: RecipeBookComponent;
  let fixture: ComponentFixture<RecipeBookComponent>;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let utilService: UtilService;
  let firebase: FirebaseService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeBookComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeBookComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    recipeService = TestBed.inject(RecipeService);
    imageService = TestBed.inject(ImageService);
    utilService = TestBed.inject(UtilService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should initialize the recipes list', fakeAsync(() => {
      const recipes = [
        new Recipe({
          id: 'recipe-1',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }, {}],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-2',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-3',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-4',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      tick();
      flush();
      expect(component.categories[0].name).toEqual('Dessert');
      expect(component.categories[0].recipes.length).toEqual(4);
      expect(component.categories[0].recipes[0].image).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    }));

    it('should handle images errors', fakeAsync(() => {
      const recipes = [
        new Recipe({
          id: 'recipe-1',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }, {}],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-2',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-3',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
        new Recipe({
          id: 'recipe-4',
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
          hasImage: true,
        }),
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());

      component.load();

      tick();
      flush();
      expect(component.categories[0].name).toEqual('Dessert');
      expect(component.categories[0].recipes.length).toEqual(4);
      expect(component.categories[0].recipes[0].image).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    }));
  });

  describe('sortCategoriesByName', () => {
    it('should sort recipe a less than recipe b', () => {
      const result = component.sortCategoriesByName(
        { name: 'a', recipes: [] },
        { name: 'b', recipes: [] }
      );

      expect(result).toEqual(-1);
    });

    it('should sort recipe b greater than recipe a', () => {
      const result = component.sortCategoriesByName(
        { name: 'b', recipes: [] },
        { name: 'a', recipes: [] }
      );

      expect(result).toEqual(1);
    });
  });

  describe('openRecipeList', () => {
    it('should navigate to the list page', () => {
      spyOn(utilService, 'setListFilter');
      spyOn(firebase, 'logEvent');

      component.openRecipeList('Dessert');

      expect(utilService.setListFilter).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
    });
  });
});
