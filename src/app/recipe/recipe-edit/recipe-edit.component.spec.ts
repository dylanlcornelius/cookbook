import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormArray,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { RecipeEditComponent } from './recipe-edit.component';
import { RecipeService } from '@recipeService';
import { BehaviorSubject, of } from 'rxjs';
import { User } from '@user';
import { Recipe } from '@recipe';
import { IngredientService } from '@ingredientService';
import { Ingredient, Ingredients } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationService } from '@modalService';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ConfigService } from '@configService';
import { Config } from '@config';
import { FormValidationDirective } from 'src/app/shared/form-validation.directive';
import { MatStepper } from '@angular/material/stepper';
import { RecipeIngredient } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';

describe('RecipeEditComponent', () => {
  let component: RecipeEditComponent;
  let fixture: ComponentFixture<RecipeEditComponent>;
  let breakpointObserver: BreakpointObserver;
  let currentUserService: CurrentUserService;
  let recipeService: RecipeService;
  let uomService: UomService;
  let ingredientService: IngredientService;
  let validationService: ValidationService;
  let configService: ConfigService;
  let recipeIngredientService: RecipeIngredientService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([{ path: 'recipe/detail/:id', component: RecipeDetailComponent }]),
        FormsModule,
        ReactiveFormsModule,
        DragDropModule,
        MatAutocompleteModule,
        MatInputModule,
        MatChipsModule,
        MatCheckboxModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [RecipeEditComponent, FormValidationDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeEditComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    spyOn(component, 'unload');
    fixture.detectChanges();
    component.load = load;
    breakpointObserver = TestBed.inject(BreakpointObserver);
    currentUserService = TestBed.inject(CurrentUserService);
    recipeService = TestBed.inject(RecipeService);
    uomService = TestBed.inject(UomService);
    ingredientService = TestBed.inject(IngredientService);
    validationService = TestBed.inject(ValidationService);
    configService = TestBed.inject(ConfigService);
    recipeIngredientService = TestBed.inject(RecipeIngredientService);

    component.recipesForm = new FormBuilder().group({
      name: [],
      link: [],
      description: [],
      time: [],
      servings: [],
      calories: [],
      categories: new FormBuilder().array([]),
      steps: new FormBuilder().array([]),
      ingredients: new FormBuilder().array([]),
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load recipes with data', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ id: 'id' });
      route.queryParams = of({ step: 1 });

      const recipe = new Recipe({
        id: 'id',
        name: 'Title',
        isServedHot: true,
        categories: [{}],
        steps: [{ step: 'step 1' }, { recipeId: 'recipe-1' }, { recipeId: 'recipe-3' }],
        ingredients: [
          {
            id: 'ingredient-1',
          },
        ],
      });

      const recipes = [
        new Recipe({ id: 'recipe-1', categories: [{ category: '1' }, { category: '2' }] }),
        new Recipe({ id: 'recipe-2', categories: [{ category: '1' }] }),
      ];

      const ingredients = [
        new Ingredient({
          id: 'ingredient-1',
        }),
        new Ingredient({
          id: 'id2',
        }),
        new Ingredient({
          id: 'id3',
        }),
      ];
      const configs = [new Config({})];

      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: false, breakpoints: {} }));
      spyOn(recipeService, 'get')
        .withArgs('id')
        .and.returnValue(of(recipe))
        .withArgs()
        .and.returnValue(of(recipes));
      spyOn(component, 'addCategory');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(recipeService, 'setForm');
      spyOn(recipeIngredientService, 'buildRecipeIngredients').and.returnValue(recipe.ingredients);
      spyOn(component, 'addIngredient');
      spyOn(component, 'refreshRecipeAsIngredients');

      component.load();
      fixture.detectChanges();
      component.categoryControl.setValue(undefined);

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(component.addCategory).toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(recipeService.setForm).not.toHaveBeenCalled();
      expect(recipeIngredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });

    it('should load recipes without data', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ id: 'id' });
      route.queryParams = of({});

      const recipe = new Recipe({
        isServedCold: true,
        ingredients: [
          {
            id: 'id2',
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'id',
        }),
      ];
      const configs = [];

      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true, breakpoints: {} }));
      spyOn(recipeService, 'get')
        .withArgs('id')
        .and.returnValue(of(recipe))
        .withArgs()
        .and.returnValue(of([]));
      spyOn(component, 'addCategory');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(recipeService, 'setForm');
      spyOn(recipeIngredientService, 'buildRecipeIngredients').and.returnValue([]);
      spyOn(component, 'addIngredient');
      spyOn(component, 'refreshRecipeAsIngredients');

      component.load();
      fixture.detectChanges();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(recipeService.setForm).not.toHaveBeenCalled();
      expect(recipeIngredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });

    it('should load ingredients for a new recipe', () => {
      component.addedIngredients = [new RecipeIngredient({ id: 'id2' })];

      const ingredients = [
        new Ingredient({
          id: 'id',
        }),
        new Ingredient({
          id: 'id2',
        }),
        new Ingredient({
          id: 'id3',
        }),
      ];
      const configs = [];

      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true, breakpoints: {} }));
      spyOn(recipeService, 'get').withArgs().and.returnValue(of([]));
      spyOn(component, 'addCategory');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(recipeService, 'setForm');
      spyOn(recipeIngredientService, 'buildRecipeIngredients');
      spyOn(component, 'addIngredient');
      spyOn(component, 'refreshRecipeAsIngredients');

      component.load();
      fixture.detectChanges();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(1);
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(recipeService.setForm).not.toHaveBeenCalled();
      expect(recipeIngredientService.buildRecipeIngredients).not.toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).not.toHaveBeenCalled();
    });

    it('should load a continued recipe', () => {
      component.addedIngredients = [new RecipeIngredient({ id: 'id2' })];

      const ingredients = [
        new Ingredient({
          id: 'id',
        }),
        new Ingredient({
          id: 'id2',
        }),
        new Ingredient({
          id: 'id3',
        }),
      ];
      const configs = [];

      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true, breakpoints: {} }));
      spyOn(recipeService, 'get').withArgs().and.returnValue(of([]));
      spyOn(component, 'addCategory');
      spyOn(ingredientService, 'get').and.returnValue(of(ingredients));
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(new Recipe({})));
      spyOn(recipeService, 'setForm');
      spyOn(recipeIngredientService, 'buildRecipeIngredients').and.returnValue([]);
      spyOn(component, 'addIngredient');
      spyOn(component, 'refreshRecipeAsIngredients');

      component.load();
      fixture.detectChanges();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(1);
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(recipeService.setForm).toHaveBeenCalled();
      expect(recipeIngredientService.buildRecipeIngredients).toHaveBeenCalled();
      expect(component.addIngredient).not.toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });

    it('should reload a recipe', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ id: 'id' });
      route.queryParams = of({});

      const recipe = new Recipe({
        isServedRoom: true,
        ingredients: [
          {
            id: 'id2',
          },
        ],
      });

      const ingredients = [
        new Ingredient({
          id: 'id',
        }),
      ];
      const configs = [];

      const ingredients$ = new BehaviorSubject<Ingredients>(ingredients);

      spyOn(breakpointObserver, 'observe').and.returnValue(of({ matches: true, breakpoints: {} }));
      spyOn(recipeService, 'get')
        .withArgs('id')
        .and.returnValue(of(recipe))
        .withArgs()
        .and.returnValue(of([]));
      spyOn(component, 'addCategory');
      spyOn(ingredientService, 'get').and.returnValue(ingredients$);
      spyOn(configService, 'get').and.returnValue(of(configs));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(recipeService, 'setForm');
      spyOn(recipeIngredientService, 'buildRecipeIngredients').and.returnValue([]);
      spyOn(component, 'addIngredient');
      spyOn(component, 'refreshRecipeAsIngredients');
      spyOn(component, 'applyIngredientFilter');

      component.load();
      ingredients$.next([]);
      fixture.detectChanges();

      expect(breakpointObserver.observe).toHaveBeenCalled();
      expect(recipeService.get).toHaveBeenCalledTimes(2);
      expect(component.addCategory).not.toHaveBeenCalled();
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(recipeService.setForm).not.toHaveBeenCalled();
      expect(recipeIngredientService.buildRecipeIngredients).toHaveBeenCalledTimes(1);
      expect(component.addIngredient).not.toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
      expect(component.applyIngredientFilter).toHaveBeenCalledTimes(2);
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
      spyOn(component, 'initCategory').and.returnValue(new FormBuilder().group({}));

      component.addCategory();

      const control = <FormArray>component.recipesForm.controls['categories'];
      expect(control.length).toEqual(1);
      expect(component.initCategory).toHaveBeenCalled();
    });
  });

  describe('addCategoryEvent', () => {
    it('should add a category', () => {
      const input = document.createElement('input');
      component.categoryInput = new ElementRef(input);

      spyOn(component, 'addCategory');

      component.addCategoryEvent('value');

      expect(component.addCategory).toHaveBeenCalled();
    });

    it('should not add a category', () => {
      const input = document.createElement('input');
      component.categoryInput = new ElementRef(input);

      spyOn(component, 'addCategory');

      component.addCategoryEvent('');

      expect(component.addCategory).not.toHaveBeenCalled();
    });
  });

  describe('removeCategory', () => {
    it('should remove a control', () => {
      component.recipesForm = new FormBuilder().group({
        categories: new FormBuilder().array([{}]),
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

    it('should init a new recipe control', () => {
      const result = component.initStep('recipe-id', 'recipe name');

      expect(result.value.recipeId).toEqual('recipe-id');
      expect(result.value.recipeName).toEqual('recipe name');
    });
  });

  describe('addStep', () => {
    it('should add a control', () => {
      spyOn(component, 'initStep').and.returnValue(new FormBuilder().group({}));
      spyOn(component, 'refreshRecipeAsIngredients');

      component.addStep();

      const control = <FormArray>component.recipesForm.controls['steps'];
      expect(control.length).toEqual(1);
      expect(component.initStep).toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });
  });

  describe('removeStep', () => {
    it('should remove a control', () => {
      component.recipesForm = new FormBuilder().group({
        steps: new FormBuilder().array([{}]),
      });

      spyOn(component, 'refreshRecipeAsIngredients');

      component.removeStep(0);

      const control = <FormArray>component.recipesForm.controls['steps'];
      expect(control.length).toEqual(0);
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });
  });

  describe('refreshRecipeAsIngredients', () => {
    it('should recalculate all recipe as ingredients', () => {
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([
          new FormBuilder().group({ id: 'recipe-1', name: 'recipe name', uom: UOM.RECIPE }),
          new FormBuilder().group({ id: 'recipe-2', name: 'recipe name 2', uom: UOM.RECIPE }),
        ]),
        steps: new FormBuilder().array([new FormBuilder().group({ step: 'step' })]),
      });

      component.refreshRecipeAsIngredients();

      expect(component.recipeAsIngredients).toEqual([
        { id: 'recipe-1', name: 'recipe name' },
        { id: 'recipe-2', name: 'recipe name 2' },
      ]);
    });
  });

  describe('moveControlInFormArray', () => {
    it('should move a form control down', () => {
      component.recipesForm = new FormBuilder().group({
        steps: new FormBuilder().array(['step-1', 'step-2']),
      });

      component.moveControlInFormArray(component.recipesForm.get('steps') as FormArray, 0, 1);

      expect(component.recipesForm.get('steps')['controls'][0].value).toEqual('step-2');
      expect(component.recipesForm.get('steps')['controls'][1].value).toEqual('step-1');
    });

    it('should move a form control up', () => {
      component.recipesForm = new FormBuilder().group({
        steps: new FormBuilder().array(['step-1', 'step-2']),
      });

      component.moveControlInFormArray(component.recipesForm.get('steps') as FormArray, 1, 0);

      expect(component.recipesForm.get('steps')['controls'][0].value).toEqual('step-2');
      expect(component.recipesForm.get('steps')['controls'][1].value).toEqual('step-1');
    });
  });

  describe('dropStep', () => {
    it('should reorder a form control', () => {
      const container = { data: ['id'] };
      const event = { previousContainer: container, container: container, item: {} };

      spyOn(component, 'moveControlInFormArray');

      component.dropStep(event);

      expect(component.moveControlInFormArray).toHaveBeenCalled();
    });
  });

  describe('moveItem', () => {
    it('should call moveItemInArray', () => {
      const list = [];

      component.moveItem(list, 0, 0);

      expect(list).toBeDefined();
    });
  });

  describe('transferItem', () => {
    it('should call transferArrayItem', () => {
      const list = [];

      component.transferItem(list, [], 0, 0);

      expect(list).toBeDefined();
    });
  });

  describe('dropAdded', () => {
    it('should reorder an item', () => {
      const container = { data: ['id'] };
      const event = { previousContainer: container, container: container, item: {} };

      spyOn(component, 'removeIngredient');
      spyOn(component, 'addIngredient');
      spyOn(component, 'moveItem');

      component.dropAdded(event);

      expect(component.removeIngredient).toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
      expect(component.moveItem).toHaveBeenCalled();
    });

    it('should move an item', () => {
      const container = { data: ['id'] };
      const event = { previousContainer: container, container: { data: ['id'] }, item: {} };

      spyOn(component, 'removeIngredient');
      spyOn(component, 'addIngredient');
      spyOn(component, 'transferItem');

      component.dropAdded(event);

      expect(component.removeIngredient).not.toHaveBeenCalled();
      expect(component.addIngredient).toHaveBeenCalled();
      expect(component.transferItem).toHaveBeenCalled();
    });
  });

  describe('dropAvailable', () => {
    it('should reorder an item', () => {
      const container = { data: ['id'] };
      const event = { previousContainer: container, container: container, item: {} };

      spyOn(component, 'removeIngredient');
      spyOn(component, 'moveItem');

      component.dropAvailable(event);

      expect(component.removeIngredient).not.toHaveBeenCalled();
      expect(component.moveItem).toHaveBeenCalled();
    });

    it('should move an item', () => {
      const container = { data: ['id'] };
      const event = { previousContainer: container, container: { data: ['id'] }, item: {} };

      spyOn(component, 'removeIngredient');
      spyOn(component, 'transferItem');

      component.dropAvailable(event);

      expect(component.removeIngredient).toHaveBeenCalled();
      expect(component.transferItem).toHaveBeenCalled();
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
      spyOn(component, 'initIngredient').and.returnValue(new FormBuilder().group({}));
      spyOn(component, 'refreshRecipeAsIngredients');

      component.addIngredient(
        0,
        new RecipeIngredient({
          id: 'id',
        })
      );

      const control = <FormArray>component.recipesForm.controls['ingredients'];
      expect(control.length).toEqual(1);
      expect(component.initIngredient).toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });

    it('should add a control without initial data', () => {
      spyOn(component, 'initIngredient').and.returnValue(new FormBuilder().group({}));
      spyOn(component, 'refreshRecipeAsIngredients');

      component.addIngredient(0);

      const control = <FormArray>component.recipesForm.controls['ingredients'];
      expect(control.length).toEqual(1);
      expect(control.value.id).toBeUndefined();
      expect(component.initIngredient).toHaveBeenCalled();
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });
  });

  describe('removeIngredient', () => {
    it('should remove a ingredient control and not a step control', () => {
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([new FormBuilder().group({ id: 'recipe-1' })]),
        steps: new FormBuilder().array([new FormBuilder().group({ step: 'step 1' })]),
      });

      spyOn(component, 'refreshRecipeAsIngredients');

      component.removeIngredient(0);

      const ingredients = <FormArray>component.recipesForm.controls['ingredients'];
      expect(ingredients.length).toEqual(0);
      const steps = <FormArray>component.recipesForm.controls['steps'];
      expect(steps.length).toEqual(1);
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });

    it('should remove an ingredient control and a steps control', () => {
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([new FormBuilder().group({ id: 'recipe-1' })]),
        steps: new FormBuilder().array([new FormBuilder().group({ recipeId: 'recipe-1' })]),
      });

      spyOn(component, 'refreshRecipeAsIngredients');

      component.removeIngredient(0);

      const ingredients = <FormArray>component.recipesForm.controls['ingredients'];
      expect(ingredients.length).toEqual(0);
      const steps = <FormArray>component.recipesForm.controls['steps'];
      expect(steps.length).toEqual(0);
      expect(component.refreshRecipeAsIngredients).toHaveBeenCalled();
    });
  });

  describe('getUOMs', () => {
    it('should return a list of uoms', () => {
      spyOn(uomService, 'relatedUOMs').and.returnValues(['tsp'], ['oz']);

      const result = component.getUOMs(UOM.CUP, UOM.LITER);

      expect(result).toEqual(['tsp', 'oz']);
      expect(uomService.relatedUOMs).toHaveBeenCalled();
    });

    it('should handle undefined', () => {
      spyOn(uomService, 'relatedUOMs').and.returnValue([]);

      const result = component.getUOMs(undefined, undefined);

      expect(result).toEqual([]);
      expect(uomService.relatedUOMs).toHaveBeenCalledTimes(2);
    });
  });

  describe('applyIngredientFilter', () => {
    it('should filter ingredients', () => {
      component.allAvailableIngredients = [new RecipeIngredient({ name: 'filter1' })];
      component.addedIngredients = [new RecipeIngredient({ id: 'id' })];

      component.applyIngredientFilter('filter');

      expect(component.availableIngredients[0].name).toEqual('filter1');
    });
  });

  describe('resetForm', () => {
    it('should open a validation modal', () => {
      spyOn(validationService, 'setModal');

      component.resetForm(new FormGroupDirective(null, null));

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('resetFormEvent', () => {
    it('should clear and reset the recipe form', () => {
      component.recipesForm = new FormGroup({
        categories: new FormBuilder().array([]),
        steps: new FormBuilder().array([]),
        ingredients: new FormBuilder().array([]),
      });

      const formDirective = new FormGroupDirective([], []);

      spyOn(formDirective, 'resetForm');
      spyOn(recipeService, 'setForm');
      spyOn(component, 'initForm');

      component.resetFormEvent(formDirective);

      expect(formDirective.resetForm).toHaveBeenCalled();
      expect(recipeService.setForm).toHaveBeenCalled();
      expect(component.initForm).toHaveBeenCalled();
    });
  });

  describe('stepperOnSubmit', () => {
    it('should return the default recipe step', () => {
      component.stepper = { selectedIndex: 1 } as MatStepper;

      const result = component.stepperOnSubmit('steps');

      expect(result).toEqual('step');
      expect(component.stepper.selectedIndex).toEqual(2);
    });

    it('should return the default recipe step', () => {
      component.stepper = { selectedIndex: 2 } as MatStepper;

      const result = component.stepperOnSubmit('ingredients');

      expect(result).toEqual('quantity');
      expect(component.stepper.selectedIndex).toEqual(1);
    });

    it('should return the default recipe step', () => {
      component.stepper = { selectedIndex: 2 } as MatStepper;

      const result = component.stepperOnSubmit('description');

      expect(result).toEqual('description');
      expect(component.stepper.selectedIndex).toEqual(0);
    });
  });

  describe('onSubmit', () => {
    it('should do nothing for an invalid form', () => {
      component.originalRecipe = new Recipe({
        id: 'id',
        author: '3',
        hasImage: true,
        meanRating: 0.33,
        creationDate: 'test',
      });
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([
          new FormBuilder().group({ name: [null, Validators.required] }),
        ]),
      });
      component.id = 'id';

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ firstName: '1', lastName: '2' }))
      );
      spyOn(recipeService, 'update');
      spyOn(router, 'navigate');

      component.onSubmit('Save');

      expect(currentUserService.getCurrentUser).not.toHaveBeenCalled();
      expect(recipeService.update).not.toHaveBeenCalledWith(
        new Recipe({
          ingredients: [{}],
          uid: '',
          author: '3',
          hasImage: true,
          meanRating: 0.33,
          ratings: [],
          creationDate: 'test',
        }).getObject(),
        'id'
      );
      expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should update a recipe', () => {
      component.originalRecipe = new Recipe({
        id: 'id',
        author: '3',
        hasImage: true,
        meanRating: 0.33,
        creationDate: 'test',
        status: 'published',
      });
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([new FormBuilder().group({ name: [] })]),
      });
      component.id = 'id';

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ firstName: '1', lastName: '2' }))
      );
      spyOn(recipeService, 'update');
      spyOn(router, 'navigate');

      component.onSubmit('Save');

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith(
        new Recipe({
          ingredients: [{}],
          uid: '',
          author: '3',
          hasImage: true,
          meanRating: 0.33,
          ratings: [],
          creationDate: 'test',
          status: 'published',
        }).getObject(),
        'id'
      );
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create a recipe', () => {
      component.originalRecipe = undefined;

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ firstName: '1', lastName: '2' }))
      );
      spyOn(recipeService, 'create').and.returnValue('id');
      spyOn(router, 'navigate');

      component.onSubmit('Save');

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.create).toHaveBeenCalledWith(
        new Recipe({
          name: '',
          link: '',
          description: '',
          time: '',
          calories: '',
          servings: '',
          quantity: '',
          categories: [],
          steps: [],
          ingredients: [],
          hasImage: false,
          meanRating: 0,
          ratings: [],
          uid: '',
          author: '1 2',
          status: 'private',
        }).getObject()
      );
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should update a recipe and redirect to creating a new recipe', () => {
      component.originalRecipe = new Recipe({
        id: 'id',
        author: '3',
        hasImage: true,
        meanRating: 0.33,
      });
      component.recipesForm = new FormBuilder().group({
        ingredients: new FormBuilder().array([
          new FormBuilder().group({ id: 'recipe-1', name: [] }),
        ]),
        steps: new FormBuilder().array([
          new FormBuilder().group({ step: 'Step 1' }),
          new FormBuilder().group({ recipeId: 'recipe-1' }),
        ]),
      });
      component.id = 'id';

      const router = TestBed.inject(Router);

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ firstName: '1', lastName: '2' }))
      );
      spyOn(recipeService, 'update');
      spyOn(router, 'navigate');

      component.onSubmit('New');

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(recipeService.update).toHaveBeenCalledWith(
        new Recipe({
          ingredients: [{ id: 'recipe-1' }],
          steps: [{ step: 'Step 1' }, { recipeId: 'recipe-1' }],
          uid: '',
          author: '3',
          hasImage: true,
          meanRating: 0.33,
          ratings: [],
        }).getObject(),
        'id'
      );
      expect(router.navigate).toHaveBeenCalledWith(['/recipe/edit']);
    });
  });
});
