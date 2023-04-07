import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { SPACE, COMMA, TAB } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '@recipeService';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl,
  FormGroupDirective,
  FormControl
} from '@angular/forms';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService } from '@ingredientService';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { ErrorMatcher } from '../../util/error-matcher';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Recipe } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { first, map, startWith, takeUntil } from 'rxjs/operators';
import { Ingredient } from '@ingredient';
import { titleCase } from 'title-case';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ValidationService } from '@modalService';
import { Validation } from '@validation';

function TitleCaseValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => control.value && control.value === titleCase(control.value) ? null : { wrongCase: titleCase(control.value || '') };
}

const SentencePattern = /^([A-Z].*(\.|\?|!)\s)*[A-Z].*(\.|\?|!)$/s;

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.scss']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  title: string;

  id: string;
  originalRecipe: Recipe;
  recipe: Recipe;
  recipesForm: FormGroup;
  categoryControl = new FormControl();

  readonly separatorKeysCodes: number[] = [SPACE, COMMA, TAB];

  addedIngredients = [];
  allAvailableIngredients = [];
  availableIngredients = [];
  ingredientFilter = '';
  recipes: Recipe[];
  ingredients;
  recipeCategories;

  uoms: Array<UOM>;

  matcher = new ErrorMatcher();
  selectable;
  stepperOrientation: Observable<StepperOrientation>;

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;

  readonly listFields = {
    categories: 'category',
    steps: 'step',
    ingredients: 'id'
  };

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private uomService: UomService,
    private validationService: ValidationService,
    private tutorialService: TutorialService,
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
        ? recipe[key].map((property) => property[listField]).join('|') !== form[key].map((property) => property[listField]).join('|')
        : recipe[key] !== form[key];
    });

    if (isUnchanged) {
      this.recipeService.setForm({ ...form, id: this.id });
    }
  }

  load(): void {
    this.stepperOrientation = this.breakpointObserver.observe('(min-width: 768px)').pipe(map(({ matches }) => matches ? 'horizontal' : 'vertical'));

    const ingredients$ = this.ingredientService.get();
    const recipes$ = this.recipeService.get();

    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      this.id = params['id'];
      this.recipesForm = this.formBuilder.group({
        name: ['', [Validators.required, TitleCaseValidator()]],
        link: [''],
        description: ['', [Validators.pattern(SentencePattern)]],
        time: [''],
        servings: ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        calories: ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
        isVegetarian: [false],
        isVegan: [false],
        isGlutenFree: [false],
        isDairyFree: [false],
        categories: this.formBuilder.array([]),
        steps: this.formBuilder.array([]),
        ingredients: this.formBuilder.array([])
      });

      const observables$: [Observable<Ingredient[]>, Observable<Recipe[]>, Observable<Recipe>?] = [ingredients$, recipes$];
      if (this.id) {
        observables$.push(this.recipeService.get(this.id));
        this.title = 'Edit a Recipe';
      } else {
        this.title = 'Add a New Recipe';
      }

      combineLatest(observables$).pipe(takeUntil(this.unsubscribe$)).subscribe(([ingredients, recipes, recipe]: [Ingredient[], Recipe[], Recipe?]) => {
        this.recipes = recipes;
        this.ingredients = ingredients;
        this.originalRecipe = recipe;

        if (this.loading) {
          this.recipeService.getForm().pipe(first()).subscribe(form => {
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
      this.recipe.categories.forEach(() => {
        this.addCategory();
      });
      this.recipe.steps.forEach(() => {
        this.addStep();
      });

      this.addedIngredients = this.ingredientService.buildRecipeIngredients(this.recipe.ingredients, [...this.ingredients, ...this.recipes]);
      for (let i = 0; i < this.addedIngredients.length; i++) {
        this.addIngredient(i);
      }

      this.recipesForm.patchValue({
        name: this.recipe.name,
        link: this.recipe.link,
        description: this.recipe.description,
        time: this.recipe.time,
        servings: this.recipe.servings,
        calories: this.recipe.calories,
        isVegetarian: this.recipe.isVegetarian,
        isVegan: this.recipe.isVegan,
        isGlutenFree: this.recipe.isGlutenFree,
        isDairyFree: this.recipe.isDairyFree,
        categories: this.recipe.categories,
        steps: this.recipe.steps,
        ingredients: this.addedIngredients,
      });
    }
  }

  initIngredients(): void {
    this.allAvailableIngredients = [...this.ingredients, ...this.recipes]
      .reduce((result, ingredient) => {
        const currentIngredient = this.addedIngredients.find(addedIngredient => addedIngredient.id === ingredient.id);
        if (!currentIngredient && ingredient.id !== this.recipe?.id) {
          result.push({ ...ingredient, isOptional: false });
        }
        return result;
      }, [])
      .sort((a, b) => a.name.localeCompare(b.name));

    this.applyIngredientFilter(false);
  }

  initCategories(): void {
    this.recipeCategories = this.categoryControl.valueChanges.pipe(
      startWith(''),
      map(value => this.recipes
        .reduce((allCategories, recipe) => {
          recipe.clearNewCategory();
          recipe.categories.forEach(({ category }) => {
            const isFound = allCategories.find(currentCategory => currentCategory === category);

            if (!isFound) {
              allCategories.push(category);
            }
          });
          return allCategories;
        }, [])
        .filter(category => category.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : ''))
        .sort((a, b) => a.localeCompare(b)))
    );
  }

  initCategory(category: string): FormGroup {
    return this.formBuilder.group({
      category: category
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

  initStep(): FormGroup {
    return this.formBuilder.group({
      step: ['', [Validators.pattern(SentencePattern)]]
    });
  }

  addStep(): void {
    const control = <FormArray>this.recipesForm.controls['steps'];
    control.push(this.initStep());
  }

  removeStep(i: number): void {
    const control = <FormArray>this.recipesForm.controls['steps'];
    control.removeAt(i);
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
      this.transferItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  dropAvailable(event: any): void {
    if (event.previousContainer === event.container) {
      this.moveItem(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.transferItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.removeIngredient(event.previousIndex);
    }
  }

  initIngredient(): FormGroup {
    return this.formBuilder.group({
      id: [null],
      quantity: [null, [Validators.required, Validators.min(0.00001), Validators.pattern(/^\d+(\.\d{1,4})?$|\d+\/\d+/)]],
      uom: [null, [Validators.required]],
      isOptional: [false],
      name: [null],
    });
  }

  addIngredient(index: number, data?: Ingredient): void {
    const control = <FormArray>this.recipesForm.controls['ingredients'];
    const ingredientControl = this.initIngredient();
    if (data) {
      ingredientControl.patchValue({
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        uom: data.uom,
        isOptional: data.isOptional,
      });
    }
    control.insert(index, ingredientControl);
  }

  removeIngredient(i: number): void {
    const control = <FormArray>this.recipesForm.controls['ingredients'];
    control.removeAt(i);
  }

  getUOMs(uom: UOM): string[] {
    if (uom) {
      return this.uomService.relatedUOMs(uom);
    }
  }

  applyIngredientFilter(filterValue: string | false): void {
    if (filterValue !== false) {
      this.ingredientFilter = filterValue.trim().toLowerCase();
    }

    this.availableIngredients = this.allAvailableIngredients.filter(ingredient => {
      return ingredient.name.toLowerCase().includes(this.ingredientFilter) && !this.addedIngredients.find(addedIngredient => {
        return ingredient.id === addedIngredient.id;
      });
    });
  }

  resetForm(formDirective: FormGroupDirective): void {
    this.validationService.setModal(new Validation(
      `Are you sure you want to undo your current changes to the recipe wizard?`,
      this.resetFormEvent,
      [formDirective]
    ));
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

  submitForm(createNew: boolean): void {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      const form = this.recipesForm.value;

      form.ingredients.forEach(ingredient => {
        delete ingredient.name;
      });

      let recipeId = this.originalRecipe?.id;
      if (this.id) {
        form.uid = this.originalRecipe.uid;
        form.author = this.originalRecipe.author;
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

      if (createNew) {
        this.router.navigate(['/recipe/edit']);
      } else {
        this.router.navigate(['/recipe/detail/', recipeId]);
      }
    });
  }

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
