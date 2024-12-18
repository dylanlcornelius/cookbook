import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@recipeService';
import { IngredientService } from '@ingredientService';
import { ImageService } from '@imageService';
import { Observable, combineLatest, Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { Recipe, RECIPE_STATUS, Recipes } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { AuthorFilter, RecipeFilterService } from '@recipeFilterService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { User } from '@user';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredients } from '@userIngredient';
import { Validation } from '@validation';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { MealPlanService } from 'src/app/shopping/shared/meal-plan.service';
import { Ingredients } from '@ingredient';
import { ConfigType } from '@configType';
import { ConfigService } from '@configService';
import { FirebaseService } from '@firebaseService';
import { TitleService } from '@TitleService';
import { Multipliers, RecipeMultiplierService } from '@recipeMultiplierService';
import { RecipeStepService } from '@recipeStepService';
import { RecipeIngredients } from '@recipeIngredient';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss'],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  online$: Observable<boolean>;

  loading = true;
  recipeHistoryModalParams;
  multipliers: Multipliers;

  user: User;
  householdId: string;
  hasAuthorPermission: boolean;
  recipe: Recipe;
  userIngredients: UserIngredients;
  ingredients: Ingredients;
  recipes: Recipes = [];
  recipeImage: string;
  recipeImageProgress;
  timesCooked: number;
  lastDateCooked: string;
  creationDate: string;
  shouldDisplayCategories: boolean;
  recipeIngredients: RecipeIngredients;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
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
    private reicpeStepService: RecipeStepService,
    private recipeMultiplierService: RecipeMultiplierService,
    private userIngredientService: UserIngredientService,
    private recipeFilterService: RecipeFilterService,
    private validationService: ValidationService,
    private mealPlanService: MealPlanService,
    private configService: ConfigService,
    private firebase: FirebaseService
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
    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.user = user;

        const household$ = this.householdService.get(this.user.uid);
        const params$ = this.route.params;

        combineLatest([household$, params$])
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(([household, params]) => {
            this.loading = this.loadingService.set(true);
            this.householdId = household.id;

            const recipe$ = this.recipeService.get(params['id']);
            const ingredients$ = this.ingredientService.get();
            const recipes$ = this.recipeService.get();
            const userIngredient$ = this.userIngredientService.get(this.householdId);
            const recipeHistory$ = this.recipeHistoryService.get(this.householdId, params['id']);
            const configs$ = this.configService.get(ConfigType.RECIPE_TYPE);

            combineLatest([
              recipe$,
              ingredients$,
              recipes$,
              userIngredient$,
              recipeHistory$,
              configs$,
            ])
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(
                ([recipe, ingredients, recipes, userIngredients, recipeHistory, configs]) => {
                  this.titleService.set(recipe.name);
                  this.recipe = recipe;
                  this.hasAuthorPermission = this.householdService.hasAuthorPermission(
                    household,
                    this.user,
                    this.recipe
                  );
                  this.imageService.download(this.recipe).then(
                    url => {
                      if (url) {
                        this.recipeImage = url;
                      }
                    },
                    () => {
                      this.recipeImage = undefined;
                    }
                  );

                  this.timesCooked = recipeHistory.timesCooked;
                  const date = recipeHistory.lastDateCooked.split('/');
                  if (date.length === 3) {
                    this.lastDateCooked = new Date(
                      Number.parseInt(date[2]),
                      Number.parseInt(date[1]) - 1,
                      Number.parseInt(date[0])
                    ).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    });
                  }
                  this.creationDate = this.recipe.creationDate?.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  });

                  this.recipes = recipes.map(recipe => {
                    recipe.ingredients = this.recipeIngredientService.buildRecipeIngredients(
                      recipe.ingredients,
                      [...ingredients, ...recipes]
                    );
                    return recipe;
                  });
                  this.userIngredients = this.userIngredientService.buildUserIngredients(
                    userIngredients,
                    ingredients
                  );
                  this.ingredients = ingredients;
                  this.recipe.ingredients = this.recipeIngredientService.buildRecipeIngredients(
                    recipe.ingredients,
                    [...ingredients, ...recipes]
                  );
                  this.recipeIngredients = this.recipeIngredientService.buildRecipeIngredients(
                    this.recipeIngredientService.findRecipeIngredients(recipe, this.recipes),
                    [...ingredients, ...recipes]
                  );
                  this.recipe.steps = this.reicpeStepService.buildRecipeSteps(this.recipe, recipes);
                  this.recipe.calories = this.recipeIngredientService.getRecipeCalories(
                    recipe,
                    recipes,
                    this.ingredients
                  );
                  this.recipe.displayType =
                    configs.find(({ value }) => value === this.recipe.type)?.displayValue || '';
                  this.recipe.hasNewCategory =
                    !this.timesCooked || (this.timesCooked === 1 && !this.recipe.hasImage);
                  this.recipe.hasNeedsImageCategory =
                    this.hasAuthorPermission && this.timesCooked && !this.recipe.hasImage;

                  this.shouldDisplayCategories = this.showDisplayCategories();
                  this.loading = this.loadingService.set(false);
                }
              );
          });
      });
  }

  showDisplayCategories(): boolean {
    return (
      !!(this.recipe.categories && this.recipe.categories.length) ||
      this.recipe.hasNewCategory ||
      this.recipe.hasNeedsImageCategory ||
      this.recipe.isVegetarian ||
      this.recipe.isVegan ||
      this.recipe.isGlutenFree ||
      this.recipe.isDairyFree ||
      !!this.recipe.type
    );
  }

  getQuantity = this.recipeMultiplierService.getQuantity;

  updateImage = (hasImage: boolean): void => {
    this.recipe.hasImage = hasImage;
    this.recipeService.update(this.recipe.getObject(), this.recipe.getId());
  };

  deleteRecipe(id: string): void {
    this.validationService.setModal(
      new Validation(
        `Are you sure you want to delete recipe ${this.recipe.name}?`,
        this.deleteRecipeEvent,
        [id]
      )
    );
  }

  deleteRecipeEvent = (id: string): void => {
    if (id) {
      this.imageService.deleteFile(id);
      this.recipeService.delete(id);
      this.notificationService.setModal(new SuccessNotification('Recipe deleted!'));
      this.router.navigate(['/recipe/list'], { replaceUrl: true });
    }
  };

  setAuthorFilter = (filter: string): void =>
    this.utilService.setListFilter(new AuthorFilter(filter));

  changeStatus = (): void => this.recipeService.changeStatus(this.recipe);

  addRecipe(): void {
    this.mealPlanService
      .get(this.householdId)
      .pipe(first())
      .subscribe(mealPlan => {
        this.mealPlanService.formattedUpdate(
          [...mealPlan.recipes, this.recipe],
          this.householdId,
          mealPlan.id
        );
        this.notificationService.setModal(new SuccessNotification('Recipe added!'));
      });
  }

  addIngredients(): void {
    this.recipeIngredientService.addIngredients(
      this.recipe,
      this.recipes,
      this.ingredients,
      this.userIngredients,
      this.user.uid,
      this.householdId
    );
  }

  onRate(rating: number, recipe: Recipe): void {
    this.recipeService.rateRecipe(rating, this.user.uid, recipe);
  }

  copyShareableLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.notificationService.setModal(new SuccessNotification('Link copied!'));
      this.firebase.logEvent('share', {
        method: 'link',
        content_type: 'recipe',
        item_id: this.recipe.id,
        item_name: this.recipe.name,
      });
    });
  }

  updateTimesCooked(recipe: Recipe): void {
    this.recipeHistoryModalParams = {
      function: this.updateRecipeHistoryEvent,
      recipeId: recipe.id,
      uid: this.user.uid,
      householdId: this.householdId,
      timesCooked: this.timesCooked,
      text: `Edit times cooked for ${recipe.name}`,
    };
  }

  updateRecipeHistoryEvent = (
    recipeId: string,
    uid: string,
    householdId: string,
    timesCooked: number,
    updateDate: boolean
  ): void => {
    this.recipeHistoryService.set(uid, recipeId, timesCooked, updateDate);
    this.recipeHistoryService.set(householdId, recipeId, timesCooked, updateDate);
    this.notificationService.setModal(new SuccessNotification('Recipe updated!'));
  };

  openRecipeEditor(): void {
    this.recipeService
      .getForm()
      .pipe(first())
      .subscribe(form => {
        if (form) {
          this.validationService.setModal(
            new Validation(
              `Are you sure you want to undo your current changes in the recipe wizard?`,
              this.openRecipeEditorEvent
            )
          );
        } else {
          this.openRecipeEditorEvent();
        }
      });
  }

  openRecipeEditorEvent = (): void => {
    this.recipeService.setForm(null);
    this.router.navigate(['/recipe/edit/', this.recipe.id], { skipLocationChange: true });
  };

  cloneRecipe(): void {
    const recipeId = this.recipeService.create({
      ...this.recipe.getObject(),
      hasImage: false,
      uid: this.user.uid,
      author: this.user.name,
      meanRating: 0,
      ratings: [],
      status: RECIPE_STATUS.PRIVATE,
    });
    this.router.navigate(['/recipe/detail/', recipeId]);
    this.notificationService.setModal(new SuccessNotification('Recipe cloned!'));
  }
}
