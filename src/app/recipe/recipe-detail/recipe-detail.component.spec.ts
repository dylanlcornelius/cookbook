import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';

import { RecipeDetailComponent } from './recipe-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecipeService } from '@recipeService';
import { Recipe } from '@recipe';
import { RecipeListComponent } from '../recipe-list/recipe-list.component';
import { ImageService } from '@imageService';
import { BehaviorSubject, of } from 'rxjs';
import { IngredientService } from '@ingredientService';
import { User } from '@user';
import { Ingredient } from '@ingredient';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { RecipeHistory } from '@recipeHistory';
import { UtilService } from '@utilService';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { HouseholdService } from '@householdService';
import { Household } from '@household';
import { TutorialService } from '@tutorialService';
import { RecipeFilterService } from '@recipeFilterService';
import { MealPlanService } from 'src/app/shopping/shared/meal-plan.service';
import { MealPlan } from 'src/app/shopping/shared/meal-plan.model';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let recipeService: RecipeService;
  let imageService: ImageService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;
  let recipeHistoryService: RecipeHistoryService;
  let utilService: UtilService;
  let userIngredientService: UserIngredientService;
  let recipeIngredientService: RecipeIngredientService;
  let recipeFilterService: RecipeFilterService;
  let validationService: ValidationService;
  let tutorialService: TutorialService;
  let mealPlanService: MealPlanService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'recipe/list', component: RecipeListComponent }
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
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    recipeService = TestBed.inject(RecipeService);
    imageService = TestBed.inject(ImageService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
    utilService = TestBed.inject(UtilService);
    userIngredientService = TestBed.inject(UserIngredientService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
    recipeFilterService = TestBed.inject(RecipeFilterService);
    validationService = TestBed.inject(ValidationService);
    tutorialService = TestBed.inject(TutorialService);
    mealPlanService = TestBed.inject(MealPlanService);

    component.recipe = new Recipe({ id: 'recipe' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('unload', () => {
    it('should set a recipe id for scroll restoration', () => {
      component.unload();

      expect(recipeFilterService.recipeId).toEqual('recipe');
    });
  });

  describe('load', () => {
    beforeEach(() => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ id: 'id' });
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
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').withArgs('id').and.returnValue(of(recipes[0])).withArgs().and.returnValue(of(recipes));
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
      expect(householdService.get).toHaveBeenCalled();
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
      const recipe = new Recipe({ creationDate: new Date() });
      const ingredients = [new Ingredient({})];
      const userIngredient = new UserIngredient({});
      const recipeHistories = new RecipeHistory({ lastDateCooked: '17/5/2021' });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').withArgs('id').and.returnValue(of(recipe)).withArgs().and.returnValue(of([]));
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
      expect(householdService.get).toHaveBeenCalled();
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
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(recipeService, 'get').withArgs('id').and.returnValue(of(recipe)).withArgs().and.returnValue(of([]));
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
      expect(householdService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(ingredientService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
      expect(ingredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(recipeIngredientService.getRecipeCount).toHaveBeenCalled();
    }));
  });

  describe('updateImage', () => {
    it('should update recipe image metadata',() => {
      spyOn(recipeService, 'update');

      component.updateImage(false);

      expect(recipeService.update).toHaveBeenCalled();
    });
  });

  describe('deleteRecipe', () => {
    it('should open a modal to delete a recipe', () => {
      spyOn(validationService, 'setModal');

      component.deleteRecipe('id');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('deleteRecipeEvent', () => {
    it('should not attempt to delete a recipe without an id', () => {
      spyOn(imageService, 'deleteFile');
      spyOn(recipeService, 'delete');
      spyOn(notificationService, 'setModal');

      component.deleteRecipeEvent('');

      expect(imageService.deleteFile).not.toHaveBeenCalled();
      expect(recipeService.delete).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });

    it('should delete a recipe', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      spyOn(imageService, 'deleteFile');
      spyOn(recipeService, 'delete');
      spyOn(notificationService, 'setModal');

      component.deleteRecipeEvent('id');

      expect(imageService.deleteFile).toHaveBeenCalled();
      expect(recipeService.delete).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
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

  describe('changeStatus', () => {
    it('should change a recipe status', () => {
      spyOn(recipeService, 'changeStatus');

      component.changeStatus();

      expect(recipeService.changeStatus).toHaveBeenCalled();
    });
  });

  describe('addIngredients', () => {
    it('should add a recipe', () => {
      spyOn(mealPlanService, 'get').and.returnValue(of(new MealPlan({})));
      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      component.addRecipe();

      expect(mealPlanService.get).toHaveBeenCalled();
      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
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
      component.user = new User({});
     
      spyOn(recipeIngredientService, 'removeIngredients');
  
      component.removeIngredients();
  
      expect(recipeIngredientService.removeIngredients).toHaveBeenCalled();
    });
  });

  describe('onRate', () => {
    it('should call the recipe service and rate a recipe', () => {
      component.user = new User({});

      spyOn(recipeService, 'rateRecipe');

      component.onRate(1, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
    });
  });

  describe('copyShareableLink', () => {
    it('should copy the current route', () => {
      spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());

      component.copyShareableLink();

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
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
      spyOn(notificationService, 'setModal');

      component.updateRecipeHistoryEvent('id', 'uid', 'householdId', 10);

      expect(recipeHistoryService.set).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
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

  describe('openTutorial', () => {
    it('should open the tutorial', () => {
      spyOn(tutorialService, 'openTutorial');

      component.openTutorial();

      expect(tutorialService.openTutorial).toHaveBeenCalled();
    });
  });
});
