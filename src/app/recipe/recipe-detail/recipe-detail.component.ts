import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@recipeService';
import { IngredientService } from '@ingredientService';
import { ImageService } from '@imageService';
import { Observable, combineLatest, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { AuthorFilter, CategoryFilter, RecipeFilterService, RestrictionFilter } from '@recipeFilterService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { User } from '@user';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredient } from '@userIngredient';
import { Validation } from '@validation';
import { HouseholdService } from '@householdService';
import { TutorialService } from '@tutorialService';
import { LoadingService } from '@loadingService';
import { MealPlanService } from 'src/app/shopping/shared/meal-plan.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  online$: Observable<boolean>;

  loading = true;
  recipeHistoryModalParams;

  user: User;
  householdId: string;
  hasAuthorPermission: boolean;
  recipe: Recipe;
  userIngredient: UserIngredient;
  ingredients = [];
  recipes = [];
  recipeImage: string;
  recipeImageProgress;
  timesCooked: number;
  lastDateCooked: string;
  creationDate: string;
  hasNewCategory = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private recipeHistoryService: RecipeHistoryService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private utilService: UtilService,
    private recipeIngredientService: RecipeIngredientService,
    private userIngredientService: UserIngredientService,
    private recipeFilterService: RecipeFilterService,
    private validationService: ValidationService,
    private tutorialService: TutorialService,
    private mealPlanService: MealPlanService,
  ) {
    this.online$ = this.utilService.online$;
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
    this.recipeFilterService.recipeId = this.recipe.id;
  }

  load(): void {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      const household$ = this.householdService.get(this.user.uid);
      const params$ = this.route.params;

      combineLatest([household$, params$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([household, params]) => {
        this.loading = this.loadingService.set(true);
        this.householdId = household.id;

        const recipe$ = this.recipeService.get(params['id']);
        const ingredients$ = this.ingredientService.get();
        const recipes$ = this.recipeService.get();
        const userIngredient$ = this.userIngredientService.get(this.householdId);
        const recipeHistory$ = this.recipeHistoryService.get(this.householdId, params['id']);

        combineLatest([recipe$, ingredients$, recipes$, userIngredient$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipe, ingredients, recipes, userIngredient, recipeHistory]) => {
          ingredients.forEach(ingredient => {
            userIngredient.ingredients.forEach(myIngredient => {
              if (ingredient.id === myIngredient.id) {
                myIngredient.uom = ingredient.uom;
                myIngredient.amount = ingredient.amount;
              }
            });

            recipes.forEach(recipe => {
              recipe.ingredients.forEach(recipeIngredient => {
                if (ingredient.id === recipeIngredient.id) {
                  recipeIngredient.amount = ingredient.amount;
                  recipeIngredient.name = ingredient.name;
                }
              });
            });
          });

          this.recipe = recipe;
          this.hasAuthorPermission = this.householdService.hasAuthorPermission(household, this.user, this.recipe);
          this.recipeImage = undefined;
          this.imageService.download(this.recipe).then(url => {
            if (url) {
              this.recipeImage = url;
            }
          }, () => { });

          this.timesCooked = recipeHistory.timesCooked;
          const date = recipeHistory.lastDateCooked.split('/');
          if (date.length === 3) {
            this.lastDateCooked = new Date(Number.parseInt(date[2]), Number.parseInt(date[1]) - 1, Number.parseInt(date[0])).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
          }
          this.creationDate = this.recipe.creationDate?.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

          this.ingredients = this.ingredientService.buildRecipeIngredients(recipe.ingredients, [...ingredients, ...recipes]);
          this.recipes = recipes;
          this.userIngredient = userIngredient;
          this.recipe.ingredients = this.ingredients;
          this.recipe.count = this.recipeIngredientService.getRecipeCount(recipe, recipes, this.userIngredient);
          this.hasNewCategory = !this.timesCooked || (this.timesCooked === 1 && !this.recipe.hasImage);
          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  updateImage = (hasImage: boolean): void => {
    this.recipe.hasImage = hasImage;
    this.recipeService.update(this.recipe.getObject(), this.recipe.getId());
  };

  deleteRecipe(id: string): void {
    this.validationService.setModal(new Validation(
      `Are you sure you want to delete recipe ${this.recipe.name}?`,
      this.deleteRecipeEvent,
      [id]
    ));
  }

  deleteRecipeEvent = (id: string): void => {
    if (id) {
      this.imageService.deleteFile(id);
      this.recipeService.delete(id);
      this.notificationService.setModal(new SuccessNotification('Recipe deleted!'));
      this.router.navigate(['/recipe/list']);
    }
  };

  shouldDisplayCategories(): boolean {
    return !!(this.recipe.categories && this.recipe.categories.length)
      || this.hasNewCategory
      || this.recipe.isVegetarian
      || this.recipe.isVegan
      || this.recipe.isGlutenFree
      || this.recipe.isDairyFree;
  }

  setCategoryFilter = (filter: string): void => this.utilService.setListFilter(new CategoryFilter(filter));
  setAuthorFilter = (filter: string): void => this.utilService.setListFilter(new AuthorFilter(filter));
  setRestrictionFilter = (filter: string): void => this.utilService.setListFilter(new RestrictionFilter(filter));

  changeStatus = (): void => this.recipeService.changeStatus(this.recipe);

  addRecipe(): void {
    this.mealPlanService.get(this.householdId).pipe(first()).subscribe(mealPlan => {
      this.mealPlanService.formattedUpdate([...mealPlan.recipes, this.recipe], this.householdId, mealPlan.id);
      this.notificationService.setModal(new SuccessNotification('Recipe added!'));
    });
  }

  addIngredients(): void {
    this.recipeIngredientService.addIngredients(this.recipe, this.recipes, this.userIngredient, this.householdId);
  }

  removeIngredients(): void {
    this.recipeIngredientService.removeIngredients(this.recipe, this.recipes, this.userIngredient, this.user.uid, this.householdId);
  }

  onRate(rating: number, recipe: Recipe): void {
    this.recipeService.rateRecipe(rating, this.user.uid, recipe);
  }

  copyShareableLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.notificationService.setModal(new SuccessNotification('Link copied!'));
    });
  }

  updateTimesCooked(recipe: Recipe): void {
    this.recipeHistoryModalParams = {
      function: this.updateRecipeHistoryEvent,
      recipeId: recipe.id,
      uid: this.user.uid,
      householdId: this.householdId,
      timesCooked: this.timesCooked,
      text: `Edit times cooked for ${recipe.name}`
    };
  }

  updateRecipeHistoryEvent = (recipeId: string, uid: string, householdId: string, timesCooked: number): void => {
    this.recipeHistoryService.set(uid, recipeId, timesCooked);
    this.recipeHistoryService.set(householdId, recipeId, timesCooked);
    this.notificationService.setModal(new SuccessNotification('Recipe updated!'));
  };

  openRecipeEditor(): void {
    this.recipeService.getForm().pipe(first()).subscribe(form => {
      if (form) {
        this.validationService.setModal(new Validation(
          `Are you sure you want to undo your current changes in the recipe wizard?`,
          this.openRecipeEditorEvent
        ));
      } else {
        this.openRecipeEditorEvent();
      }
    });
  }

  openRecipeEditorEvent = (): void => {
    this.recipeService.setForm(null);
    this.router.navigate(['/recipe/edit/', this.recipe.id]);
  };

  openTutorial = (): void => this.tutorialService.openTutorial(true);

  cloneRecipe(): void {
    const recipeId = this.recipeService.create({
      ...this.recipe.getObject(),
      hasImage: false,
      uid: this.user.uid,
      author: this.user.name,
      meanRating: 0,
      ratings: [],
      status: RECIPE_STATUS.PRIVATE
    });
    this.router.navigate(['/recipe/detail/', recipeId]);
    this.notificationService.setModal(new SuccessNotification('Recipe cloned!'));
  }
}
