import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { UOMConversion, UOM } from 'src/app/ingredient/shared/uom.emun';
import { RecipeEditComponent } from './recipe-edit.component';
import { RecipeService } from '@recipeService';
import { of } from 'rxjs';
import { User } from 'src/app/user/shared/user.model';
import { Recipe } from '../shared/recipe.model';
import { IngredientService } from '@ingredientService';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import * as cdk from '@angular/cdk/drag-drop';

describe('RecipeEditComponent', () => {
  let component: RecipeEditComponent;
  let fixture: ComponentFixture<RecipeEditComponent>;
  let currentUserService: CurrentUserService;
  let recipeService: RecipeService;
  let uomConversion: UOMConversion;
  let formBuilder: FormBuilder;
  let ingredientService: IngredientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'recipe/detail/:id', component: RecipeDetailComponent}
        ]),
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        UOMConversion
      ],
      declarations: [ RecipeEditComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    recipeService = TestBed.inject(RecipeService);
    uomConversion = TestBed.inject(UOMConversion);
    formBuilder = TestBed.inject(FormBuilder);
    ingredientService = TestBed.inject(IngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load recipes with data', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {id: 'testId'};

      const recipe = new Recipe({
        categories: [{}],
        steps: [{}],
        ingredients: [{
          id: 'id'
        }]
      });

      const ingredients = [new Ingredient({
        id: 'id'
      })]

      spyOn(recipeService, 'get').and.returnValue(of(recipe));
      spyOn(component, 'addCategory');
      spyOn(component, 'addStep');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(component, 'addIngredient');

      component.load();

      expect(recipeService.get).toHaveBeenCalled();
      expect(component.addCategory).toHaveBeenCalled();
      // expect(component.addStep).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
    });

    it('should load recipes without data', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {id: 'testId'};

      const recipe = new Recipe({
        ingredients: [{
          id: 'id2'
        }]
      });

      const ingredients = [new Ingredient({
        id: 'id'
      })]

      spyOn(recipeService, 'get').and.returnValue(of(recipe));
      spyOn(component, 'addCategory');
      spyOn(component, 'addStep');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(component, 'addIngredient');

      component.load();

      expect(recipeService.get).toHaveBeenCalled();
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(component.addStep).not.toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
    });

    it('should reload recipes with data', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {id: 'testId'};

      component.loading = false;

      const recipe = new Recipe({
        categories: [{}],
        steps: [{}],
        ingredients: [{
          id: 'id'
        }]
      });

      const ingredients = [new Ingredient({
        id: 'id'
      })]

      spyOn(recipeService, 'get').and.returnValue(of(recipe));
      spyOn(component, 'addCategory');
      spyOn(component, 'addStep');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(component, 'addIngredient');

      component.load();

      expect(recipeService.get).toHaveBeenCalled();
      expect(component.addCategory).not.toHaveBeenCalled();
      // expect(component.addStep).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
    });

    it('should load ingredients for a new recipe', () => {
      const recipe = new Recipe({
        ingredients: [{
          id: 'id2'
        }]
      });

      const ingredients = [new Ingredient({
        id: 'id'
      })]

      spyOn(recipeService, 'get');
      spyOn(component, 'addCategory');
      spyOn(component, 'addStep');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(component, 'addIngredient');

      component.load();

      expect(recipeService.get).not.toHaveBeenCalled();
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(component.addStep).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
    });
  });

  describe('initCategory', () => {
    it('should init a new control', () => {
      const result = component.initCategory('test');

      expect(result).toBeDefined();
    });
  });

  describe('addCategory', () => {
    it('should add a control', () => {
      spyOn(component, 'initCategory').and.returnValue(formBuilder.group({}));

      component.addCategory();

      const control = <FormArray>component.recipesForm.controls['categories'];
      expect(control.length).toEqual(1);
      expect(component.initCategory).toHaveBeenCalled();
    });
  });

  describe('addCategoryEvent', () => {
    it('should add a category', () => {
      spyOn(component, 'addCategory');

      component.addCategoryEvent({ input: {input: 'value'}, value: 'value'});
    
      expect(component.addCategory).toHaveBeenCalled();
    });

    it('should not add a category', () => {
      spyOn(component, 'addCategory');

      component.addCategoryEvent({ input: undefined, value: ''});
    
      expect(component.addCategory).not.toHaveBeenCalled();
    });
  });

  describe('removeCategory', () => {
    it('should remove a control', () => {
      component.recipesForm = formBuilder.group({
        'categories': formBuilder.array([{}])
      });

      component.removeCategory(0);

      const control = <FormArray>component.recipesForm.controls['categories'];
      expect(control.length).toEqual(0);
    });
  });

  describe('initStep', () => {
    it('should init a new control', () => {
      const result = component.initStep();

      expect(result).toBeDefined();
    });
  });

  describe('addStep', () => {
    it('should add a control', () => {
      spyOn(component, 'initStep').and.returnValue(formBuilder.group({}));

      component.addStep();

      const control = <FormArray>component.recipesForm.controls['steps'];
      expect(control.length).toEqual(2);
      expect(component.initStep).toHaveBeenCalled();
    });
  });

  describe('removeStep', () => {
    it('should remove a control', () => {
      component.recipesForm = formBuilder.group({
        'steps': formBuilder.array([{}])
      });

      component.removeStep(0);

      const control = <FormArray>component.recipesForm.controls['steps'];
      expect(control.length).toEqual(0);
    });
  });

  describe('dropAdded', () => {
    it('should reorder an item', () => {
      const container = {data: ['id']};
      const event = { previousContainer: container, container: container, item: {}};

      spyOn(component, 'removeIngredient');
      spyOn(component, 'addIngredient');
      const funcSpy = jasmine.createSpy('moveItemInArray');
      spyOnProperty(cdk, 'moveItemInArray', 'get').and.returnValue(funcSpy);

      component.dropAdded(event);

      expect(component.removeIngredient).toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
    });

    it('should move an item', () => {
      const container = {data: ['id']};
      const event = { previousContainer: container, container: {data: ['id']}, item: {}};

      spyOn(component, 'removeIngredient');
      spyOn(component, 'addIngredient');
      const funcSpy = jasmine.createSpy('transferArrayItem');
      spyOnProperty(cdk, 'transferArrayItem', 'get').and.returnValue(funcSpy);

      component.dropAdded(event);

      expect(component.removeIngredient).not.toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
    });
  });

  describe('dropAvailable', () => {
    it('should reorder an item', () => {
      const container = {data: ['id']};
      const event = { previousContainer: container, container: container, item: {}};

      spyOn(component, 'removeIngredient');
      const funcSpy = jasmine.createSpy('moveItemInArray');
      spyOnProperty(cdk, 'moveItemInArray', 'get').and.returnValue(funcSpy);

      component.dropAvailable(event);

      expect(component.removeIngredient).not.toHaveBeenCalled();
    });

    it('should move an item', () => {
      const container = {data: ['id']};
      const event = { previousContainer: container, container: {data: ['id']}, item: {}};

      spyOn(component, 'removeIngredient');
      const funcSpy = jasmine.createSpy('transferArrayItem');
      spyOnProperty(cdk, 'transferArrayItem', 'get').and.returnValue(funcSpy);

      component.dropAvailable(event);

      expect(component.removeIngredient).toHaveBeenCalled();
    });
  });

  describe('initIngredient', () => {
    it('should init a new control', () => {
      const result = component.initIngredient();

      expect(result).toBeDefined();
    });
  });

  // setValue - no form controls registered with this group yet
  describe('addIngredient', () => {
    it('should add a control', () => {
      spyOn(component, 'initIngredient').and.returnValue(formBuilder.group({}));

      component.addIngredient(0, {
        id: 'id'
      });

      const control = <FormArray>component.recipesForm.controls['ingredients'];
      expect(control.length).toEqual(1);
      expect(component.initIngredient).toHaveBeenCalled();
    });

    it('should add a control without initial data', () => {
      spyOn(component, 'initIngredient').and.returnValue(formBuilder.group({}));

      component.addIngredient(0);

      const control = <FormArray>component.recipesForm.controls['ingredients'];
      expect(control.length).toEqual(1);
      expect(control.value.id).toBeUndefined();
      expect(component.initIngredient).toHaveBeenCalled();
    });
  });

  describe('removeIngredient', () => {
    it('should remove a control', () => {
      component.recipesForm = formBuilder.group({
        'ingredients': formBuilder.array([{}])
      });

      component.removeIngredient(0);

      const control = <FormArray>component.recipesForm.controls['ingredients'];
      expect(control.length).toEqual(0);
    });
  });

  describe('getUOMs', () => {
    it('should return a list of uoms', () => {
      spyOn(uomConversion, 'relatedUOMs').and.returnValue([]);

      const result = component.getUOMs(UOM.CUP);

      expect(result).toEqual([]);
      expect(uomConversion.relatedUOMs).toHaveBeenCalled();
    });

    it('should handle undefined', () => {
      spyOn(uomConversion, 'relatedUOMs');

      component.getUOMs(undefined);

      expect(uomConversion.relatedUOMs).not.toHaveBeenCalled();
    });
  });

  describe('applyIngredientFilter', () => {
    it('should filter ingredients', () => {
      component.allAvailableIngredients = [{
        name: 'filter1'
      }];

      component.addedIngredients = [{
        id: 'id'
      }];

      component.applyIngredientFilter('filter');

      expect(component.availableIngredients[0].name).toEqual('filter1');
    });
  });

  describe('submitForm', () => {
    it('should update a recipe', () => {
      component.recipe = new Recipe({id: 'testId', author: '3', hasImage: true, meanRating: 0.33});
      component.recipesForm = formBuilder.group({
        'ingredients': formBuilder.array([formBuilder.group({'name': []})])
      });
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {id: 'testId'};

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({firstName: '1', lastName: '2'})));
      spyOn(recipeService, 'update');
      spyOn(router, 'navigate');

      component.submitForm();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith({
        ingredients: [{}],
        uid: '',
        author: '3',
        hasImage: true,
        meanRating: 0.33,
        ratings: []
      }, 'testId');
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create a recipe', () => {
      component.recipe = new Recipe({id: 'testId'});

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({firstName: '1', lastName: '2'})));
      spyOn(recipeService, 'create').and.returnValue('testId');
      spyOn(router, 'navigate');

      component.submitForm();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.create).toHaveBeenCalledWith({
        name: null,
        link: null,
        description: null,
        time: '',
        servings: '',
        calories: '',
        categories: [],
        steps: [{step: null}],
        ingredients: [],
        uid: '',
        author: '1 2',
      });
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
