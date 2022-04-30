import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { Household } from '@household';
import { HouseholdService } from '@householdService';
import { Ingredient } from '@ingredient';
import { IngredientService } from '@ingredientService';
import { NotificationService } from '@modalService';
import { Recipe } from '@recipe';
import { RecipeIngredientService } from '@recipeIngredientService';
import { RecipeService } from '@recipeService';
import { TutorialService } from '@tutorialService';
import { User } from '@user';
import { UserIngredient } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { of } from 'rxjs';
import { MealPlan } from '../shared/meal-plan.model';
import { MealPlanService } from '../shared/meal-plan.service';

import { MealPlannerComponent } from './meal-planner.component';

describe('MealPlannerComponent', () => {
  let component: MealPlannerComponent;
  let fixture: ComponentFixture<MealPlannerComponent>;
  let mealPlanService: MealPlanService;
  let userIngredientService: UserIngredientService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let recipeService: RecipeService;
  let ingredientService: IngredientService;
  let notificationService: NotificationService;
  let tutorialService: TutorialService;
  let recipeIngredientService: RecipeIngredientService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        MatAutocompleteModule,
      ],
      declarations: [ MealPlannerComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MealPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    mealPlanService = TestBed.inject(MealPlanService);
    userIngredientService = TestBed.inject(UserIngredientService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    recipeService = TestBed.inject(RecipeService);
    ingredientService = TestBed.inject(IngredientService);
    notificationService = TestBed.inject(NotificationService);
    tutorialService = TestBed.inject(TutorialService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load the meal plan', () => {
      const userIngredient = new UserIngredient({
        ingredients: [
          { id: 'ingredient' },
          { id: 'ingredient2' }
        ]
      });
      const recipes = [
        new Recipe({
          id: 'id',
          name: 'recipe',
          ingredients: [
            { id: 'ingredient' },
            { id: 'ingredient3' }
          ]
        }),
        new Recipe({
          id: 'id2',
          name: 'recipe2',
          ingredients: [
            { id: 'ingredient' },
            { id: 'ingredient3' }
          ]
        })
      ];
      const ingredients = [new Ingredient({id: 'ingredient'})];
      const mealPlan = new MealPlan({
        recipes: [{ id: 'id' }, { id: 'recipe-id-deleted' }]
      });

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userIngredientService, 'get').and.returnValue(of(userIngredient));
      spyOn(recipeService, 'get').and.returnValue(of(recipes));
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(mealPlanService, 'get').and.returnValue(of(mealPlan));

      component.load();
      fixture.detectChanges();
      component.recipeControl.setValue(undefined);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(userIngredientService.get).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(mealPlanService.get).toHaveBeenCalled();
      expect(component.mealPlan.recipes.length).toEqual(1);
    });
  });

  describe('addRecipe', () => {
    it('should add a recipe', () => {
      component.mealPlan = new MealPlan({});

      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(component.recipeControl, 'reset');
      spyOn(notificationService, 'setModal');

      component.addRecipe(new Recipe({name: 'name'}));

      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
      expect(component.recipeControl.reset).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeRecipe', () => {
    it('should remove a recipe', () => {
      component.mealPlan = new MealPlan({ recipes: [new Recipe({}), new Recipe({})] });

      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(notificationService, 'setModal');

      component.removeRecipe(1);

      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(component.mealPlan.recipes.length).toEqual(1);
    });
  });

  describe('addIngredients', () => {
    it('should add recipe ingredients', () => {
      component.mealPlan = new MealPlan({ recipes: [new Recipe({}), new Recipe({})] });

      spyOn(mealPlanService, 'formattedUpdate');
      const spy = jasmine.createSpy('addIngredients');
      recipeIngredientService.addIngredients = spy;

      component.addIngredients(1);
      spy.calls.mostRecent().args[4](true);

      expect(spy).toHaveBeenCalled();
      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
    });

    it('should not add recipe ingredients', () => {
      component.mealPlan = new MealPlan({ recipes: [new Recipe({}), new Recipe({})] });

      spyOn(mealPlanService, 'formattedUpdate');
      const spy = jasmine.createSpy('addIngredients');
      recipeIngredientService.addIngredients = spy;

      component.addIngredients(1);
      // testing a local callback
      spy.calls.mostRecent().args[4]();

      expect(spy).toHaveBeenCalled();
      expect(mealPlanService.formattedUpdate).not.toHaveBeenCalled();
    });
  });

  describe('addAllIngredients', () => {
    it('should handle cancelling', () => {
      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(recipeIngredientService, 'addIngredients');

      component.addAllIngredients();

      expect(mealPlanService.formattedUpdate).not.toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).not.toHaveBeenCalled();
    });

    it('should handle an empty list', () => {
      component.mealPlan = new MealPlan({ recipes: [] });

      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(recipeIngredientService, 'addIngredients');

      component.addAllIngredients(false, true);

      expect(mealPlanService.formattedUpdate).not.toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).not.toHaveBeenCalled();
    });

    it('should start adding ingredients', () => {
      component.mealPlan = new MealPlan({ recipes: [ new Recipe({}) ] });

      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(recipeIngredientService, 'addIngredients');

      component.addAllIngredients(false, true);

      expect(mealPlanService.formattedUpdate).not.toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).toHaveBeenCalled();
    });

    it('should start continue ingredients', () => {
      component.mealPlan = new MealPlan({ recipes: [ new Recipe({}), new Recipe({}) ] });

      spyOn(mealPlanService, 'formattedUpdate');
      spyOn(recipeIngredientService, 'addIngredients');

      component.addAllIngredients(true, false);

      expect(mealPlanService.formattedUpdate).toHaveBeenCalled();
      expect(recipeIngredientService.addIngredients).toHaveBeenCalled();
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
