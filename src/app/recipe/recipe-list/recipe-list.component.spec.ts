import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
  waitForAsync,
  flush,
} from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import {
  MatLegacyTableDataSource as MatTableDataSource,
  MatLegacyTableModule as MatTableModule,
} from '@angular/material/legacy-table';
import { of } from 'rxjs/internal/observable/of';
import { RecipeService } from '@recipeService';
import {
  RecipeFilterService,
  CategoryFilter,
  RatingFilter,
  AuthorFilter,
  SearchFilter,
  StatusFilter,
  ImageFilter,
  RestrictionFilter,
  TypeFilter,
} from '@recipeFilterService';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredient } from '@userIngredient';
import { IngredientService } from '@ingredientService';
import { ImageService } from '@imageService';
import { User } from '@user';

import { RecipeListComponent } from './recipe-list.component';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { Ingredient } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { HouseholdService } from '@householdService';
import { Household } from '@household';
import { BreakpointObserver } from '@angular/cdk/layout';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { NotificationService, ValidationService } from '@modalService';
import { BehaviorSubject } from 'rxjs';
import {
  MatLegacyPaginatorModule as MatPaginatorModule,
  LegacyPageEvent as PageEvent,
} from '@angular/material/legacy-paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MealPlanService } from 'src/app/shopping/shared/meal-plan.service';
import { MealPlan } from 'src/app/shopping/shared/meal-plan.model';
import { RecipeHistoryService } from '@recipeHistoryService';
import { RecipeHistory } from '@recipeHistory';
import { UOM } from '@uoms';
import { ConfigService } from '@configService';
import { Config } from '@config';
import { FirebaseService } from '@firebaseService';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let breakpointObserver: BreakpointObserver;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let recipeService: RecipeService;
  let recipeFilterService: RecipeFilterService;
  let userIngredientService: UserIngredientService;
  let ingredientService: IngredientService;
  let imageService: ImageService;
  let recipeIngredientService: RecipeIngredientService;
  let validationService: ValidationService;
  let mealPlanService: MealPlanService;
  let notificationService: NotificationService;
  let recipeHistoryService: RecipeHistoryService;
  let configService: ConfigService;
  let firebase: FirebaseService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        MatTableModule,
        MatPaginatorModule,
        FormsModule,
        BrowserAnimationsModule,
      ],
      providers: [
        CurrentUserService,
        RecipeService,
        RecipeFilterService,
        UserIngredientService,
        IngredientService,
        ImageService,
      ],
      declarations: [RecipeListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    breakpointObserver = TestBed.inject(BreakpointObserver);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    recipeService = TestBed.inject(RecipeService);
    recipeFilterService = TestBed.inject(RecipeFilterService);
    userIngredientService = TestBed.inject(UserIngredientService);
    ingredientService = TestBed.inject(IngredientService);
    imageService = TestBed.inject(ImageService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
    validationService = TestBed.inject(ValidationService);
    mealPlanService = TestBed.inject(MealPlanService);
    notificationService = TestBed.inject(NotificationService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
    configService = TestBed.inject(ConfigService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should initialize the recipes list', fakeAsync(() => {
      const recipes = [
        new Recipe({
          id: 'recipe',
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
        }),
        new Recipe({}),
      ];
      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
        }),
      ];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          name: 'ingredient name',
        }),
        new Ingredient({
          id: 'ingredientId2',
        }),
      ];
      const histories = [
        new RecipeHistory({
          recipeId: 'recipe',
          timesCooked: 1,
        }),
      ];
      const configs = [new Config({})];

      const element = document.createElement('div');
      element.id = 'recipe';
      document.getElementsByClassName('search-bar')[0].appendChild(element);

      recipeFilterService.recipeId = 'recipe';

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(histories));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));
      spyOn(component, 'initFilters');

      component.load();

      tick();
      flush();
      expect(component.dataSource.data[0].image).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.initFilters).toHaveBeenCalled();
    }));

    it('should handle falsey values', fakeAsync(() => {
      const recipes = [
        new Recipe({
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
        }),
        new Recipe({
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
        }),
      ];
      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
        }),
      ];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
        }),
        new Ingredient({
          id: 'ingredientId2',
        }),
      ];
      const histories = [
        new RecipeHistory({
          recipeId: 'recipe',
        }),
      ];
      const configs = [];

      recipeFilterService.recipeId = 'recipe';

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(histories));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());
      spyOn(component, 'initFilters');

      component.load();

      tick();
      flush();
      expect(component.dataSource.data[0].image).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.initFilters).toHaveBeenCalled();
    }));

    it('should handle images errors', fakeAsync(() => {
      const router = TestBed.inject(Router);

      const recipes = [
        new Recipe({
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
          categories: [],
          author: '',
        }),
      ];
      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
        }),
      ];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
        }),
        new Ingredient({
          id: 'ingredientId2',
        }),
      ];
      const histories = [
        new RecipeHistory({
          recipeId: 'recipe',
        }),
      ];
      const configs = [];

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(histories));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(imageService, 'download').and.returnValue(Promise.reject());
      spyOn(component, 'initFilters');

      component.load();

      tick();
      expect(component.dataSource.data[0].image).toBeUndefined();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.initFilters).toHaveBeenCalled();

      const result = router.routeReuseStrategy.shouldReuseRoute(null, null);

      expect(result).toEqual(false);
    }));

    it('should not update recipe ingredients by reference', fakeAsync(() => {
      const recipes = [
        new Recipe({
          id: 'recipe1',
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
          status: RECIPE_STATUS.PUBLISHED,
          categories: [{ category: 'Dessert' }],
        }),
        new Recipe({
          id: 'recipe2',
          ingredients: [
            {
              id: 'recipe3',
              isOptional: true,
              uom: UOM.RECIPE,
            },
          ],
        }),
        new Recipe({
          id: 'recipe3',
          ingredients: [
            {
              id: 'ingredientId',
            },
          ],
        }),
      ];
      const userIngredients = [
        new UserIngredient({
          ingredientId: 'ingredientId',
        }),
      ];
      const ingredients = [
        new Ingredient({
          id: 'ingredientId',
          name: 'ingredient name',
        }),
        new Ingredient({
          id: 'ingredientId2',
        }),
      ];
      const histories = [
        new RecipeHistory({
          recipeId: 'recipe1',
          timesCooked: 1,
        }),
      ];
      const configs = [];

      const element = document.createElement('div');
      element.id = 'recipe';
      document.getElementsByClassName('search-bar')[0].appendChild(element);

      recipeFilterService.recipeId = 'recipe';

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredients));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(recipeHistoryService, 'get').and.returnValue(of(histories));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));
      spyOn(component, 'initFilters');

      component.load();

      tick();
      flush();
      expect(component.dataSource.data[0].image).toEqual('url');
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(component.initFilters).toHaveBeenCalled();
      expect(
        component.recipes.find(({ id }) => id === 'recipe1').ingredients[0].isOptional
      ).toBeFalse();
      expect(
        component.recipes.find(({ id }) => id === 'recipe2').ingredients[0].isOptional
      ).toBeTrue();
      expect(
        component.recipes.find(({ id }) => id === 'recipe3').ingredients[0].isOptional
      ).toBeFalse();
    }));
  });

  describe('initFilters', () => {
    it('should apply all filters', fakeAsync(() => {
      component.dataSource = new MatTableDataSource([]);

      component.recipes = [
        new Recipe({
          type: 'SALAD',
          categories: [{ category: 'thing' }, { category: 'thingy' }],
          author: 'author',
          hasNewCategory: true,
          hasNeedsImageCategory: true,
        }),
        new Recipe({
          categories: [],
          author: 'author2',
        }),
      ];
      component.types = [new Config({})];

      recipeFilterService.selectedFilters = [
        new RatingFilter(1),
        new CategoryFilter('New!'),
        new CategoryFilter('Needs Image'),
        new AuthorFilter('author'),
        new TypeFilter('SALAD'),
        new RestrictionFilter('isVegetarian'),
        new SearchFilter('search'),
        new StatusFilter(RECIPE_STATUS.PUBLISHED),
        new ImageFilter(false),
      ];

      spyOn(component, 'setFilters');
      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true, breakpoints: {} }));
      spyOn(component, 'setSelectedFilterCount');
      spyOn(firebase, 'logEvent');

      component.initFilters();
      component.searchFilter$.next('value');

      tick(1000);
      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
      expect(component.searchFilter).toEqual('value');
      expect(component.setFilters).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
    }));

    it('should only apply a search filter', fakeAsync(() => {
      component.dataSource = { paginator: { firstPage: () => {} } };

      component.recipes = [
        new Recipe({
          categories: [
            {
              category: 'category',
            },
            {
              category: 'category',
            },
          ],
          status: RECIPE_STATUS.PUBLISHED,
          author: 'author',
        }),
        new Recipe({}),
      ];
      component.types = [];

      spyOn(component, 'setFilters');
      spyOn(component.dataSource.paginator, 'firstPage');
      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: false, breakpoints: {} }));
      spyOn(component, 'setSelectedFilterCount');
      spyOn(firebase, 'logEvent');

      component.initFilters();
      component.initFilters();
      component.searchFilter$.next('value');

      tick(1000);
      expect(breakpointObserver.observe).toHaveBeenCalledTimes(2);
      expect(component.setSelectedFilterCount).toHaveBeenCalledTimes(2);
      expect(component.searchFilter).toEqual('value');
      expect(component.setFilters).toHaveBeenCalled();
      expect(component.dataSource.paginator.firstPage).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
    }));
  });

  describe('setSelectedFilterCount', () => {
    it('should count the number of checked filters and set the count', () => {
      component.filtersList = [
        {
          displayName: '',
          name: '',
          values: [
            { displayName: '', name: '', checked: true, filter: new CategoryFilter('') },
            { displayName: '', name: '', checked: false, filter: new CategoryFilter('') },
          ],
        },
      ];

      component.setSelectedFilterCount();

      expect(component.filtersList[0].numberOfSelected).toEqual(1);
    });

    it('should count the number of checked filters and set the count', () => {
      component.filtersList = [
        {
          icon: 'icon',
          iconTooltip: '',
          values: [
            {
              displayName: '',
              name: '',
              values: [
                { displayName: '', name: '', checked: true, filter: new CategoryFilter('') },
                { displayName: '', name: '', checked: false, filter: new CategoryFilter('') },
              ],
            },
          ],
        },
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
      component.searchFilter = ' FILTER ';

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

      component.filterSelected({ checked: true, name: 'test', filter });

      expect(recipeFilterService.selectedFilters).toContain(filter);
    });

    it('should unapply a filter', () => {
      const filter1 = new CategoryFilter('test');
      const filter2 = new CategoryFilter('test1');
      const filter3 = new AuthorFilter('author');
      recipeFilterService.selectedFilters = [filter1, filter2, filter3];

      component.filterSelected({ checked: false, name: 'test', filter: filter1 });

      expect(recipeFilterService.selectedFilters).not.toContain(filter1);
      expect(recipeFilterService.selectedFilters).toContain(filter2);
      expect(recipeFilterService.selectedFilters).toContain(filter3);
    });

    afterEach(() => {
      expect(component.setFilters).toHaveBeenCalled();
      expect(component.setSelectedFilterCount).toHaveBeenCalled();
    });
  });

  describe('searchChanged', () => {
    it('should set the next search filter value', fakeAsync(() => {
      component.searchFilter$.pipe(take(1)).subscribe(filterValue => {
        expect(filterValue).toEqual('value');
      });

      component.searchChanged('value');

      tick();
    }));
  });

  describe('clearFilters', () => {
    it('should clear and re-initialize filters', () => {
      recipeFilterService.selectedFilters = [new SearchFilter('search')];

      spyOn(component, 'initFilters');
      spyOn(component, 'setFilters');

      component.clearFilters();

      expect(recipeFilterService.selectedFilters).toHaveSize(0);
      expect(component.initFilters).toHaveBeenCalled();
      expect(component.setFilters).toHaveBeenCalled();
    });
  });

  describe('isDisplayFilter', () => {
    it('should narrow filter types to a regular filter', () => {
      const filters = {
        displayName: '',
        name: '',
        values: [],
      };

      const result = component.isDisplayFilter(filters);

      expect(result).toBeTrue();
    });

    it('should narrow filter types to a nested filter', () => {
      const filters = {
        icon: '',
        iconTooltip: '',
        values: [
          {
            displayName: '',
            name: '',
            values: [],
          },
        ],
      };

      const result = component.isDisplayFilter(filters);

      expect(result).toBeFalse();
    });
  });

  describe('sortRecipesByName', () => {
    it('should sort recipe a less than recipe b', () => {
      const result = component.sortRecipesByName(
        new Recipe({ name: 'a' }),
        new Recipe({ name: 'b' })
      );

      expect(result).toEqual(-1);
    });

    it('should sort recipe b greater than recipe a', () => {
      const result = component.sortRecipesByName(
        new Recipe({ name: 'b' }),
        new Recipe({ name: 'a' })
      );

      expect(result).toEqual(1);
    });
  });

  describe('sortRecipesByImages', () => {
    it('should sort two recipes with images', () => {
      const result = component.sortRecipesByImages(
        new Recipe({ hasImage: true }),
        new Recipe({ hasImage: true })
      );

      expect(result).toEqual(0);
    });

    it('should sort recipe a with an image', () => {
      const result = component.sortRecipesByImages(new Recipe({ hasImage: true }), new Recipe({}));

      expect(result).toEqual(-1);
    });

    it('should sort recipe b with an image', () => {
      const result = component.sortRecipesByImages(new Recipe({}), new Recipe({ hasImage: true }));

      expect(result).toEqual(1);
    });

    it('should two recipes with no images', () => {
      const result = component.sortRecipesByImages(new Recipe({}), new Recipe({}));

      expect(result).toEqual(0);
    });
  });

  describe('findRecipe', () => {
    it('should find a recipe', () => {
      component.dataSource = new MatTableDataSource([new Recipe({ id: 'id' })]);

      const result = component.findRecipe('id');

      expect(result).toBeDefined();
    });

    it('should not find a recipe', () => {
      component.dataSource = new MatTableDataSource([new Recipe({ id: 'id2' })]);

      const result = component.findRecipe('id');

      expect(result).toBeUndefined();
    });
  });

  describe('changeStatus', () => {
    it('should change recipe status', () => {
      spyOn(recipeService, 'changeStatus');

      component.changeStatus(new Recipe({}));

      expect(recipeService.changeStatus).toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add a recipe', () => {
      spyOn(mealPlanService, 'get').and.returnValue(of(new MealPlan({})));
      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      component.addRecipe(new Recipe({}));

      expect(mealPlanService.get).toHaveBeenCalled();
      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add ingredients', () => {
      component.user = new User({});

      spyOn(component, 'findRecipe').and.returnValue(new Recipe({}));
      spyOn(recipeIngredientService, 'addIngredients');

      component.addIngredients('');

      expect(component.findRecipe).toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).toHaveBeenCalled();
    });
  });

  describe('onRate', () => {
    it('should call the recipe service and rate a recipe', () => {
      component.user = new User({ uid: 'uid' });

      spyOn(recipeService, 'rateRecipe');

      component.onRate(1, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
    });
  });

  describe('openRecipeEditor', () => {
    it('should open a validation modal', () => {
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(validationService, 'setModal');
      spyOn(component, 'openRecipeEditorEvent');

      component.openRecipeEditor();

      expect(recipeService.getForm).toHaveBeenCalled();
      expect(validationService.setModal).not.toHaveBeenCalled();
      expect(component.openRecipeEditorEvent).toHaveBeenCalled();
    });

    it('should not open a validation modal', () => {
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject({}));
      spyOn(validationService, 'setModal');
      spyOn(component, 'openRecipeEditorEvent');

      component.openRecipeEditor();

      expect(recipeService.getForm).toHaveBeenCalled();
      expect(validationService.setModal).toHaveBeenCalled();
      expect(component.openRecipeEditorEvent).not.toHaveBeenCalled();
    });
  });

  describe('openRecipeEditorEvent', () => {
    it('should reset the editor form and navigate', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(recipeService, 'setForm');

      component.openRecipeEditorEvent();

      expect(recipeService.setForm).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });
  });

  describe('openRecipeDetail', () => {
    it('should navigate to the detail page', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(firebase, 'logEvent');

      component.openRecipeDetail(new Recipe({}));

      expect(router.navigate).toHaveBeenCalled();
      expect(firebase.logEvent).toHaveBeenCalled();
    });
  });

  describe('pageEvent', () => {
    it('should store the page index', () => {
      const event = new PageEvent();
      event.pageIndex = 2;
      event.previousPageIndex = 1;

      component.pageEvent(event);

      expect(recipeFilterService.pageIndex).toEqual(2);
    });

    it('should store the page index and scroll down', () => {
      const event = new PageEvent();
      event.pageIndex = 1;
      event.previousPageIndex = 2;

      component.pageEvent(event);

      expect(recipeFilterService.pageIndex).toEqual(1);
    });
  });

  describe('handlePageBottom', () => {
    it('should store the page index', () => {
      const event = new PageEvent();
      event.pageIndex = 2;

      component.handlePageBottom(event);

      expect(component.paginator.pageIndex).toEqual(2);
    });
  });
});
