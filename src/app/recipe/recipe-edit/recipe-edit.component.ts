import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SPACE, COMMA, TAB } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RecipeService } from '@recipeService';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
  FormGroupDirective,
  FormControl,
} from '@angular/forms';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService } from '@ingredientService';
import { UOM, UOMs } from '@uoms';
import { UomService } from '@uomService';
import { ErrorMatcher } from '../../util/error-matcher';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Recipe, Recipes } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { Ingredients } from '@ingredient';
import { titleCase } from 'title-case';
import { LoadingService } from '@loadingService';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ValidationService } from '@modalService';
import { Validation } from '@validation';
import { ConfigService } from '@configService';
import { Configs } from '@config';
import { ConfigType } from '@configType';
import { TitleService } from '@TitleService';
import { RecipeIngredient, RecipeIngredients } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';

function TitleCaseValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null =>
    control.value && control.value === titleCase(control.value)
      ? null
      : { wrongCase: titleCase(control.value || '') };
}

const SentencePattern = /^([A-Z].*(\.|\?|!)\s)*[A-Z].*(\.|\?|!)$/s;

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;
  title: string;
  selectedIndex = 0;

  id: string;
  originalRecipe: Recipe;
  recipe: Recipe;
  recipesForm: FormGroup;
  categoryControl = new FormControl();

  readonly separatorKeysCodes: number[] = [SPACE, COMMA, TAB];

  addedIngredients: RecipeIngredients = [];
  allAvailableIngredients: RecipeIngredients = [];
  availableIngredients: RecipeIngredients = [];
  ingredientFilter = '';
  recipes: Recipes;
  ingredients: Ingredients;
  recipeCategories;
  recipeAsIngredients: { id: string; name: string }[];
  types: Configs;

  uoms: UOMs;

  matcher = new ErrorMatcher();
  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('stepper')
  stepper: MatStepper;

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  readonly listFields = {
    categories: 'category',
    steps: 'step',
    ingredients: 'id',
  };

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private titleService: TitleService,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private uomService: UomService,
    private validationService: ValidationService,
    private configService: ConfigService,
    private recipeIngredientService: RecipeIngredientService
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

    this.unload();
  }

  unload(): void {
    const recipe = this.originalRecipe || new Recipe({});
    const form = this.recipesForm.value;

    const isUnchanged = Object.keys(form).find(key => {
      const listField = this.listFields[key];

      return listField
        ? recipe[key].map(property => property[listField]).join('|') !==
            form[key].map(property => property[listField]).join('|')
        : recipe[key] !== form[key];
    });

    if (isUnchanged) {
      this.recipeService.setForm({ ...form, id: this.id });
    }
  }

  load(): void {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 768px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));

    const queryParams$ = this.route.queryParams;
    const ingredients$ = this.ingredientService.get();
    const recipes$ = this.recipeService.get();
    const configs$ = this.configService.get(ConfigType.RECIPE_TYPE);

    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      this.id = params['id'];
      this.recipesForm = new FormBuilder().group({
        name: ['', [Validators.required, TitleCaseValidator()]],
        link: [''],
        description: ['', [Validators.pattern(SentencePattern)]],
        time: [''],
        servings: ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        type: [''],
        isVegetarian: [false],
        isVegan: [false],
        isGlutenFree: [false],
        isDairyFree: [false],
        categories: new FormBuilder().array([]),
        steps: new FormBuilder().array([]),
        ingredients: new FormBuilder().array([]),
      });

      const observables$: [
        Observable<Params>,
        Observable<Ingredients>,
        Observable<Recipes>,
        Observable<Configs>,
        Observable<Recipe>?
      ] = [queryParams$, ingredients$, recipes$, configs$];
      if (this.id) {
        observables$.push(this.recipeService.get(this.id));
        this.title = 'Edit a Recipe';
      } else {
        this.titleService.set('Create a New Recipe');
        this.title = 'Create a New Recipe';
      }

      combineLatest(observables$)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([queryParams, ingredients, recipes, configs, recipe]) => {
          this.selectedIndex = queryParams['step'] || 0;
          this.ingredients = ingredients;
          this.recipes = recipes;
          this.types = configs;
          this.originalRecipe = recipe;

          if (this.loading) {
            this.recipeService
              .getForm()
              .pipe(first())
              .subscribe(form => {
                if (form) {
                  this.recipe = form;
                  this.recipeService.setForm(null);
                } else {
                  this.recipe = recipe;
                }

                this.initForm();
                this.initIngredients();
                this.initCategories();

                this.loading = this.loadingService.set(false);
              });
          } else {
            this.initIngredients();
            this.initCategories();
          }
        });
    });
  }

  initForm(): void {
    if (this.recipe) {
      this.titleService.set(`Edit ${this.recipe.name}`);

      this.recipe.categories.forEach(() => {
        this.addCategory();
      });

      this.addedIngredients = this.recipeIngredientService.buildRecipeIngredients(
        this.recipe.ingredients,
        [...this.ingredients, ...this.recipes]
      );
      for (let i = 0; i < this.addedIngredients.length; i++) {
        this.addIngredient(i);
      }
      this.recipe.steps.forEach(({ recipeId }) => {
        if (recipeId) {
          const recipe = this.recipes.find(({ id }) => id === recipeId);
          if (recipe) {
            this.addStep(recipeId, recipe?.name);
          }
        } else {
          this.addStep();
        }
      });

      this.recipesForm.patchValue({
        name: this.recipe.name,
        link: this.recipe.link,
        description: this.recipe.description,
        time: this.recipe.time,
        servings: this.recipe.servings,
        type: this.recipe.type,
        isVegetarian: this.recipe.isVegetarian,
        isVegan: this.recipe.isVegan,
        isGlutenFree: this.recipe.isGlutenFree,
        isDairyFree: this.recipe.isDairyFree,
        categories: this.recipe.categories,
        steps: this.recipe.steps,
        ingredients: this.addedIngredients,
      });
      this.refreshRecipeAsIngredients();
    }
  }

  initIngredients(): void {
    this.allAvailableIngredients = [...this.ingredients, ...this.recipes]
      .reduce((result, ingredient) => {
        const currentIngredient = this.addedIngredients.find(
          addedIngredient => addedIngredient.id === ingredient.id
        );
        if (!currentIngredient && ingredient.id !== this.recipe?.id) {
          result.push(
            new RecipeIngredient({
              ...ingredient,
              isOptional: false,
              volumeUnit: ingredient.uom,
              weightUnit: 'altUOM' in ingredient ? ingredient.altUOM : null,
            })
          );
        }
        return result;
      }, [] as RecipeIngredients)
      .sort((a, b) => a.name.localeCompare(b.name));

    this.applyIngredientFilter(false);
  }

  initCategories(): void {
    this.recipeCategories = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value =>
        this.recipes
          .reduce((allCategories, { categories }) => {
            categories
              .filter(({ category }) => category !== 'New!' && category !== 'Needs Image')
              .forEach(({ category }) => {
                const isFound = allCategories.find(currentCategory => currentCategory === category);

                if (!isFound) {
                  allCategories.push(category);
                }
              });
            return allCategories;
          }, [])
          .filter(category =>
            category.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : '')
          )
          .sort((a, b) => a.localeCompare(b))
      )
    );
  }

  initCategory(category: string): FormGroup {
    return new FormBuilder().group({
      category: category,
    });
  }

  addCategory(category?: string): void {
    const control = <FormArray>this.recipesForm.controls['categories'];
    control.push(this.initCategory(category));
  }

  addCategoryEvent = (value: string): void => {
    if (value && value.trim()) {
      this.addCategory(value.trim());
    }

    this.categoryInput.nativeElement.value = '';
  };

  removeCategory(i: number): void {
    const control = <FormArray>this.recipesForm.controls['categories'];
    control.removeAt(i);
  }

  initStep(recipeId?: string, recipeName?: string): FormGroup {
    return recipeId
      ? new FormBuilder().group({
          recipeId: [recipeId],
          recipeName: [recipeName],
        })
      : new FormBuilder().group({
          step: ['', [Validators.pattern(SentencePattern)]],
        });
  }

  addStep(recipeId?: string, recipeName?: string): void {
    const steps = <FormArray>this.recipesForm.controls['steps'];
    steps.push(this.initStep(recipeId, recipeName));
    this.refreshRecipeAsIngredients();
  }

  removeStep(index: number): void {
    const steps = <FormArray>this.recipesForm.controls['steps'];
    steps.removeAt(index);
    this.refreshRecipeAsIngredients();
  }

  refreshRecipeAsIngredients(): void {
    const ingredients = <FormArray>this.recipesForm.controls['ingredients'];
    const steps = <FormArray>this.recipesForm.controls['steps'];

    this.recipeAsIngredients = ingredients.controls
      .reduce((list, ingredient) => {
        if (
          ingredient.get('uom').value === UOM.RECIPE &&
          !steps.controls.some(step => step.get('recipeId')?.value === ingredient.get('id').value)
        ) {
          list.push({
            id: ingredient.get('id').value,
            name: ingredient.get('name').value,
          });
        }
        return list;
      }, [] as typeof this.recipeAsIngredients)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  moveControlInFormArray(formArray: FormArray, fromIndex: number, toIndex: number): void {
    const dir = toIndex > fromIndex ? 1 : -1;
    const from = fromIndex;
    const to = toIndex;

    const temp = formArray.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(to, temp);
  }

  dropStep(event: any): void {
    this.moveControlInFormArray(event.container.data, event.previousIndex, event.currentIndex);
  }

  moveItem(data: any[], previous: number, current: number): void {
    moveItemInArray(data, previous, current);
  }

  transferItem(previousData: any[], data: any[], previous: number, current: number): void {
    transferArrayItem(previousData, data, previous, current);
  }

  dropAdded(event: any): void {
    if (event.previousContainer === event.container) {
      this.removeIngredient(event.previousIndex);
      this.addIngredient(event.currentIndex, event.item.data);
      this.moveItem(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.addIngredient(event.currentIndex, event.item.data);
      this.transferItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  dropAvailable(event: any): void {
    if (event.previousContainer === event.container) {
      this.moveItem(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.transferItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.removeIngredient(event.previousIndex);
    }
  }

  initIngredient(): FormGroup {
    return new FormBuilder().group({
      id: [null],
      quantity: [
        null,
        [
          Validators.required,
          Validators.min(0.00001),
          Validators.pattern(/^\d+(\.\d{1,4})?$|\d+\/\d+/),
        ],
      ],
      uom: [null, [Validators.required]],
      isOptional: [false],
      name: [null],
      volumeUnit: [null],
      weightUnit: [null],
    });
  }

  addIngredient(index: number, data?: RecipeIngredient): void {
    const ingredients = <FormArray>this.recipesForm.controls['ingredients'];
    const ingredientControl = this.initIngredient();
    if (data) {
      ingredientControl.patchValue({
        id: data.id,
        quantity: data.quantity,
        uom: data.uom,
        isOptional: data.isOptional,
        name: data.name,
        volumeUnit: data.volumeUnit,
        weightUnit: data.weightUnit,
      });
    }
    ingredients.insert(index, ingredientControl);
    this.refreshRecipeAsIngredients();
  }

  removeIngredient(index: number): void {
    const ingredients = <FormArray>this.recipesForm.controls['ingredients'];

    const ingredient = ingredients.controls[index].value;
    const steps = <FormArray>this.recipesForm.controls['steps'];
    const recipeIndex = steps.controls.findIndex(
      control => control.get('recipeId')?.value === ingredient.id
    );
    if (recipeIndex !== -1) {
      steps.removeAt(recipeIndex);
    }

    ingredients.removeAt(index);
    this.refreshRecipeAsIngredients();
  }

  getUOMs(volumeUnit: UOM, weightUnit: UOM): string[] {
    return [...this.uomService.relatedUOMs(volumeUnit), ...this.uomService.relatedUOMs(weightUnit)];
  }

  applyIngredientFilter(filterValue: string | false): void {
    if (filterValue !== false) {
      this.ingredientFilter = filterValue.trim().toLowerCase();
    }

    this.availableIngredients = this.allAvailableIngredients.filter(ingredient => {
      return (
        ingredient.name.toLowerCase().includes(this.ingredientFilter) &&
        !this.addedIngredients.find(addedIngredient => {
          return ingredient.id === addedIngredient.id;
        })
      );
    });
  }

  resetForm(formDirective: FormGroupDirective): void {
    this.validationService.setModal(
      new Validation(
        `Are you sure you want to undo your current changes to the recipe wizard?`,
        this.resetFormEvent,
        [formDirective]
      )
    );
  }

  resetFormEvent = (formDirective: FormGroupDirective): void => {
    formDirective.resetForm();
    const categories = <FormArray>this.recipesForm.controls['categories'];
    categories.clear();
    const steps = <FormArray>this.recipesForm.controls['steps'];
    steps.clear();
    const ingredients = <FormArray>this.recipesForm.controls['ingredients'];
    ingredients.clear();
    this.recipesForm.reset();
    this.recipeService.setForm(null);
    this.recipe = this.originalRecipe || new Recipe({});
    this.initForm();
  };

  stepperOnSubmit = (key: string): string => {
    if (key === 'steps') {
      this.stepper.selectedIndex = 2;
      return 'step';
    }
    if (key === 'ingredients') {
      this.stepper.selectedIndex = 1;
      return 'quantity';
    }
    this.stepper.selectedIndex = 0;
    return key;
  };

  onSubmit(buttonName: string): void {
    if (this.recipesForm.invalid) {
      return;
    }

    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        const form = this.recipesForm.value;

        form.ingredients.forEach(ingredient => {
          delete ingredient.name;
          delete ingredient.volumeUnit;
          delete ingredient.weightUnit;
        });

        let recipeId = this.originalRecipe?.id;
        if (this.id) {
          form.uid = this.originalRecipe.uid;
          form.author = this.originalRecipe.author;
          form.status = this.originalRecipe.status;
          form.hasImage = this.originalRecipe.hasImage;
          form.meanRating = this.originalRecipe.meanRating;
          form.ratings = this.originalRecipe.ratings;
          form.creationDate = this.originalRecipe.creationDate;

          this.recipeService.update(new Recipe(form).getObject(), this.originalRecipe.id);
        } else {
          form.uid = user.uid;
          form.author = user.name;

          recipeId = this.recipeService.create(new Recipe(form).getObject());
        }

        this.originalRecipe = this.recipesForm.value;

        if (buttonName === 'New') {
          this.router.navigate(['/recipe/edit']);
        } else {
          this.router.navigate(['/recipe/detail/', recipeId]);
        }
      });
  }
}
