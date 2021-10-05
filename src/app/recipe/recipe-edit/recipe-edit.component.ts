import { Component, OnInit, OnDestroy } from '@angular/core';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '@recipeService';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ValidatorFn,
  AbstractControl
} from '@angular/forms';
import { moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService} from '@ingredientService';
import { UOM, UOMConversion } from '@UOMConverson';
import { ErrorMatcher } from '../../util/error-matcher';
import { combineLatest, Subject } from 'rxjs';
import { Recipe } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { takeUntil } from 'rxjs/operators';
import { Ingredient } from '@ingredient';
import { titleCase } from 'title-case';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';

function TitleCaseValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => control.value && control.value === titleCase(control.value) ? null : { wrongCase: titleCase(control.value || '') };
}

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
  recipe: Recipe;
  recipesForm: FormGroup;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  addedIngredients = [];
  allAvailableIngredients = [];
  availableIngredients = [];

  uoms: Array<UOM>;

  matcher = new ErrorMatcher();
  selectable;

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private uomConversion: UOMConversion,
    private tutorialService: TutorialService,
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.init();

    this.router.events.pipe(takeUntil(this.unsubscribe$)).subscribe(() => this.init());
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  init(): void {
    this.recipesForm = this.formBuilder.group({
      name: [null, [Validators.required, TitleCaseValidator()]],
      link: [null],
      description: [null],
      time: [''],
      servings: ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      calories: ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      categories: this.formBuilder.array([]),
      steps: this.formBuilder.array([]),
      ingredients: this.formBuilder.array([])
    });

    this.load();
  }

  load(): void {
    const ingredients$ = this.ingredientService.get();
    const recipes$ = this.recipeService.get();

    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      this.id = params['id'];

      if (this.id) {
        const recipe$ = this.recipeService.get(this.id);
  
        combineLatest([recipe$, ingredients$, recipes$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipe, ingredients, recipes]) => {
          if (this.loading) {
            this.recipe = recipe;
  
            recipe.categories.forEach(() => {
              this.addCategory();
            });
            recipe.steps.forEach(() => {
              this.addStep();
            });
  
            // figure out already added ingredients
            this.addedIngredients = this.ingredientService.buildRecipeIngredients(recipe.ingredients, [...ingredients, ...recipes]);
            for (let i = 0; i < this.addedIngredients.length; i++) {
              this.addIngredient(i);
            }
  
            this.recipesForm.patchValue({
              name: recipe.name,
              link: recipe.link,
              description: recipe.description,
              time: recipe.time,
              servings: recipe.servings,
              calories: recipe.calories,
              categories: recipe.categories,
              steps: recipe.steps,
              ingredients: this.addedIngredients,
            });
          }
  
          // figure out available ingredients
          this.allAvailableIngredients = [...ingredients, ...recipes]
            .reduce((result, ingredient) => {
              const currentIngredient = this.addedIngredients.find(addedIngredient => addedIngredient.id === ingredient.id);
              if (!currentIngredient && ingredient.id !== this.recipe.id) {
                result.push({
                  ...ingredient,
                  quantity: 0
                });
              }
              return result;
            }, [])
            .sort((a, b) => a.name.localeCompare(b.name));
          this.availableIngredients = this.allAvailableIngredients;
  
          this.title = 'Edit a Recipe';
          this.loading = this.loadingService.set(false);
        });
      } else {
        combineLatest([ingredients$, recipes$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([ingredients, recipes]) => {
          this.allAvailableIngredients = [...ingredients, ...recipes]
            .reduce((result, ingredient) => {
              const currentIngredient = this.addedIngredients.find(addedIngredient => addedIngredient.id === ingredient.id);
              if (!currentIngredient) {
                result.push({
                  ...ingredient,
                  quantity: 0
                });
              }
              return result;
            }, [])
            .sort((a, b) => a.name.localeCompare(b.name));
  
          this.availableIngredients = this.allAvailableIngredients;
  
          this.title = 'Add a new Recipe';
          this.loading = this.loadingService.set(false);
        });
      }
    });
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

  addCategoryEvent = (event: any): void => {
    const input = event.input;
    const value = event.value;

    if (value && value.trim()) {
      this.addCategory(value.trim());
    }

    if (input) {
      input.value = '';
    }
  };

  removeCategory(i: number): void {
    const control = <FormArray>this.recipesForm.controls['categories'];
    control.removeAt(i);
  }

  initStep(): FormGroup {
    return this.formBuilder.group({
      step: [null]
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
      return this.uomConversion.relatedUOMs(uom);
    }
  }

  applyIngredientFilter(filterValue: string): void {
    const filter = filterValue.trim().toLowerCase();

    this.availableIngredients = this.allAvailableIngredients.filter(ingredient => {
      return ingredient.name.toLowerCase().includes(filter) && !this.addedIngredients.find(addedIngredient => {
          return ingredient.id === addedIngredient.id;
      });
    });
  }

  submitForm(createNew: boolean): void {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      const form = this.recipesForm.value;

      form.ingredients.forEach(ingredient => {
        delete ingredient.name;
      });

      let recipeId = this.recipe?.id;
      if (this.id) {
        form.uid = this.recipe.uid;
        form.author = this.recipe.author;
        form.hasImage = this.recipe.hasImage;
        form.meanRating = this.recipe.meanRating;
        form.ratings = this.recipe.ratings;

        this.recipeService.update(new Recipe(form).getObject(), this.recipe.id);
      } else {
        form.uid = user.uid;
        form.author = user.name;

        recipeId = this.recipeService.create(new Recipe(form));
      }

      if (createNew) {
        this.router.navigate(['/recipe/edit']);
      } else {
        this.router.navigate(['/recipe/detail/', recipeId]);
      }
    });
  }

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
