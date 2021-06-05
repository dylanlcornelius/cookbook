import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { of } from 'rxjs/internal/observable/of';
import { UOMConversion } from '@UOMConverson';
import { RecipeService } from '@recipeService';
import { RecipeFilterService, CategoryFilter, RatingFilter, AuthorFilter, SearchFilter } from '@recipeFilterService';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredient } from '@userIngredient';
import { IngredientService } from '@ingredientService';
import { ImageService } from '@imageService';
import { User } from '@user';

import { RecipeListComponent } from './recipe-list.component';
import { Recipe } from '@recipe';
import { Ingredient } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { RecipeIngredientService } from '@recipeIngredientService';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let currentUserService: CurrentUserService;
  let recipeService: RecipeService;
  let recipeFilterService: RecipeFilterService;
  let userIngredientService: UserIngredientService;
  let ingredientService: IngredientService;
  let imageService: ImageService;
  let recipeIngredientService: RecipeIngredientService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatTableModule
      ],
      providers: [
        CurrentUserService,
        RecipeService,
        RecipeFilterService,
        UserIngredientService,
        IngredientService,
        ImageService,
        UOMConversion,
      ],
      declarations: [
        RecipeListComponent,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    recipeService = TestBed.inject(RecipeService);
    recipeFilterService = TestBed.inject(RecipeFilterService);
    userIngredientService = TestBed.inject(UserIngredientService);
    ingredientService = TestBed.inject(IngredientService);
    imageService = TestBed.inject(ImageService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should initialize the recipes list', fakeAsync(() => {
      const recipes = [
        new Recipe({
          ingredients: [{
            id: 'ingredientId',
          }],
          categories: [{
            category: 'category'
          },
          {
            category: 'category'
          }],
          author: 'author'
        }),
        new Recipe({})
      ];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          name: 'ingredient name'
        }),
        new Ingredient({
          id: 'ingredientId2'
        })
      ];

      recipeFilterService.selectedFilters = [new RatingFilter(1), new CategoryFilter(''), new AuthorFilter('author'), new SearchFilter('search')];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeIngredientService, 'getRecipeCount');
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));
      spyOn(component, 'setSelectedFilterCount');

      component.load();

      tick();
      expect(component.dataSource.data[0].image).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
    }));

    it('should handle falsey values', fakeAsync(() => {
      const recipes = [
        new Recipe({
          ingredients: [{
            id: 'ingredientId'
          }],
          categories: [{ category: 'thing' }, { category: 'thingy'}],
          author: 'author'
        }),
        new Recipe({
          ingredients: [{
            id: 'ingredientId'
          }],
          categories: [],
          author: 'author2'
        })
      ];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredientId'
        }),
        new Ingredient({
          id: 'ingredientId2'
        })
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeIngredientService, 'getRecipeCount');
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());
      spyOn(component, 'setSelectedFilterCount');

      component.load();

      tick();
      expect(component.dataSource.data[0].image).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
    }));

    it('should handle images errors', fakeAsync(() => {
      const recipes = [
        new Recipe({
          ingredients: [{
            id: 'ingredientId'
          }],
          categories: [],
          author: ''
        })
      ];

      const userIngredient = new UserIngredient({
        ingredients: [{
          id: 'ingredientId'
        }]
      });

      const ingredients = [
        new Ingredient({
          id: 'ingredientId'
        }),
        new Ingredient({
          id: 'ingredientId2'
        })
      ];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeIngredientService, 'getRecipeCount');
      spyOn(imageService, 'download').and.returnValue(Promise.reject());
      spyOn(component, 'setSelectedFilterCount');

      component.load();

      tick();
      expect(component.dataSource.data[0].image).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
    }));
  });

  describe('setSelectedFilterCount', () => {
    it('should count the number of checked filters and set the count', () => {
      component.filtersList = [
        {
          values: [
            {checked: true},
            {checked: false}
          ]
        }
      ];

      component.setSelectedFilterCount();

      expect(component.filtersList[0].numberOfSelected).toEqual(1);
    });
  });

  describe('setFilters', () => {
    it('should set the dataSource filter from the filters list', () => {
      component.dataSource = new MatTableDataSource();
      const filter = new CategoryFilter('category');
      recipeFilterService.selectedFilters = [filter];
      component.searchFilter = undefined;

      component.setFilters();

      expect(component.dataSource.filter).toEqual([filter]);
    });

    it('should set the dataSource filter from the filters list and search filter', () => {
      component.dataSource = new MatTableDataSource();
      const filter = new CategoryFilter('category');
      recipeFilterService.selectedFilters = [filter];
      component.searchFilter = 'filter';

      component.setFilters();

      expect(component.dataSource.filter.length).toEqual(2);
    });
  });

  describe('filterSelected', () => {
    beforeEach(() => {
      spyOn(component, 'setFilters');
      spyOn(component, 'setSelectedFilterCount');
    });

    it('should apply a filter', () => {
      const filter = new CategoryFilter('test');
      recipeFilterService.selectedFilters = [];

      component.filterSelected({checked: true, name: 'test', filter});

      expect(recipeFilterService.selectedFilters).toContain(filter);
    });

    it('should unapply a filter', () => {
      const filter = new CategoryFilter('test');
      const filter2 = new AuthorFilter('author');
      recipeFilterService.selectedFilters = [filter, filter2];

      component.filterSelected({checked: false, name: 'test', filter});

      expect(recipeFilterService.selectedFilters).not.toContain(filter);
      expect(recipeFilterService.selectedFilters).toContain(filter2);
    });

    afterEach(() => {
      expect(component.setFilters).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
    });
  });

  describe('applySearchFilter', () => {
    it('should apply a filter', () => {
      component.dataSource = new MatTableDataSource([]);

      spyOn(component, 'setFilters');

      component.applySearchFilter(' VALUE ');

      expect(component.searchFilter).toEqual('value');
      expect(component.setFilters).toHaveBeenCalled();
    });

    it('should apply a filter and go to the first page', () => {
      component.dataSource = {paginator: {firstPage: () => {}}};

      spyOn(component, 'setFilters');
      spyOn(component.dataSource.paginator, 'firstPage');

      component.applySearchFilter(' VALUE ');

      expect(component.searchFilter).toEqual('value');
      expect(component.setFilters).toHaveBeenCalled();
      expect(component.dataSource.paginator.firstPage).toHaveBeenCalled();
    });
  });

  describe('sortRecipesByName', () => {
    it('should sort recipe a less than recipe b', () => {
      const result = component.sortRecipesByName(new Recipe({name: 'a'}), new Recipe({name: 'b'}));

      expect(result).toEqual(-1);
    });

    it('should sort recipe b greater than recipe a', () => {
      const result = component.sortRecipesByName(new Recipe({name: 'b'}), new Recipe({name: 'a'}));

      expect(result).toEqual(1);
    });
  });

  describe('sortRecipesByImages', () => {
    it('should sort two recipes with images', () => {
      const result = component.sortRecipesByImages(new Recipe({hasImage: true}), new Recipe({hasImage: true}));

      expect(result).toEqual(0);
    });

    it('should sort recipe a with an image', () => {
      const result = component.sortRecipesByImages(new Recipe({hasImage: true}), new Recipe({}));
     
      expect(result).toEqual(-1);
    });

    it('should sort recipe b with an image', () => {
      const result = component.sortRecipesByImages(new Recipe({}), new Recipe({hasImage: true}));

      expect(result).toEqual(1);
    });

    it('should two recipes with no images', () => {
      const result = component.sortRecipesByImages(new Recipe({}), new Recipe({}));

      expect(result).toEqual(0);
    });
  });

  describe('findRecipe', () => {
    it('should find a recipe', () => {
      component.dataSource = new MatTableDataSource([new Recipe({id: 'id'})]);

      const result = component.findRecipe('id');

      expect(result).toBeDefined();
    });

    it('should not find a recipe', () => {
      component.dataSource = new MatTableDataSource([new Recipe({id: 'id2'})]);

      const result = component.findRecipe('id');

      expect(result).toBeUndefined();
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients', () => {
      spyOn(component, 'findRecipe').and.returnValue(new Recipe({}));
      spyOn(recipeIngredientService, 'addIngredients');

      component.addIngredients('');

      expect(component.findRecipe).toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).toHaveBeenCalled();
    });
  });

  describe('removeIngredients', () => {
    it('should remove ingredients', () => {
      spyOn(component, 'findRecipe').and.returnValue(new Recipe({}));
      spyOn(recipeIngredientService, 'removeIngredients');
  
      component.removeIngredients('');
  
      expect(component.findRecipe).toHaveBeenCalled();
      expect(recipeIngredientService.removeIngredients).toHaveBeenCalled();
    });
  });

  describe('onRate', () => {
    it('should call the recipe service and rate a recipe', () => {
      component.user = new User({uid: 'uid'});

      spyOn(recipeService, 'rateRecipe');

      component.onRate(1, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
    });
  });
});
