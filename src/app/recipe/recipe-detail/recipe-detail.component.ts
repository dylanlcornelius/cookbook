import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@recipeService';
import { IngredientService} from '@ingredientService';
import { ImageService } from '@imageService';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { AuthorFilter, CategoryFilter } from '@recipeFilterService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { User } from '@user';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredient } from '@userIngredient';
import { Validation } from '@validation';
import { HouseholdService } from '@householdService';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    private validationService: ValidationService,
  ) {
    this.online$ = this.utilService.online$;
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const recipe$ = this.recipeService.get(this.route.snapshot.params['id']);
        const ingredients$ = this.ingredientService.get();
        const recipes$ = this.recipeService.get();
        const userIngredient$ = this.userIngredientService.get(this.householdId);
        const recipeHistory$ = this.recipeHistoryService.get(this.householdId, this.route.snapshot.params['id']);

        combineLatest([recipe$, ingredients$, recipes$, userIngredient$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipe, ingredients, recipes, userIngredient, recipeHistory]) => {
          this.recipe = recipe;
          this.userIngredient = userIngredient;

          this.hasAuthorPermission = this.householdService.hasAuthorPermission(household, this.user, this.recipe);

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

          this.imageService.download(this.recipe).then(url => {
            if (url) {
              this.recipeImage = url;
            }
          }, () => {});

          this.timesCooked = recipeHistory.timesCooked;
          const date = recipeHistory.lastDateCooked.split('/');
          if (date.length === 3) {
            this.lastDateCooked = new Date(Number.parseInt(date[2]), Number.parseInt(date[1]) - 1, Number.parseInt(date[0])).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
          }

          this.ingredients = this.ingredientService.buildRecipeIngredients(recipe.ingredients, [...ingredients, ...recipes]);
          this.recipes = recipes;
          this.recipe.ingredients = this.ingredients;
          this.recipe.count = this.recipeIngredientService.getRecipeCount(recipe, recipes, this.userIngredient);
          this.loading = false;
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

  setCategoryFilter = (filter: string): void => this.utilService.setListFilter(new CategoryFilter(filter));
  setAuthorFilter = (filter: string): void => this.utilService.setListFilter(new AuthorFilter(filter));

  changeStatus = (): void => this.recipeService.changeStatus(this.recipe);

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
}
