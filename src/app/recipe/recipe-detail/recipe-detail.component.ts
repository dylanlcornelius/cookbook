import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@recipeService';
import { IngredientService} from '@ingredientService';
import { ImageService } from '@imageService';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from '@recipe';
import { CurrentUserService } from '@currentUserService';
import { NotificationService } from '@notificationService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { AuthorFilter, CategoryFilter } from '@recipeFilterService';
import { RecipeIngredientService } from '@recipeIngredientService';
import { User } from '@user';
import { UserIngredientService } from '@userIngredientService';
import { UserIngredient } from '@userIngredient';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  online$: Observable<boolean>;

  loading = true;
  validationModalParams;

  user: User;
  recipe: Recipe;
  userIngredient: UserIngredient;
  ingredients = [];
  recipeImage: string;
  recipeImageProgress;
  timesCooked: number;
  lastDateCooked: Date;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: CurrentUserService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private recipeHistoryService: RecipeHistoryService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private utilService: UtilService,
    private recipeIngredientService: RecipeIngredientService,
    private userIngredientService: UserIngredientService,
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

  load() {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      
      const recipe$ = this.recipeService.get(this.route.snapshot.params['id']);
      const ingredients$ = this.ingredientService.get();
      const userIngredient$ = this.userIngredientService.get(this.user.defaultShoppingList);
      const recipeHistory$ = this.recipeHistoryService.get(user.defaultShoppingList, this.route.snapshot.params['id']);

      combineLatest([recipe$, ingredients$, userIngredient$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipe, ingredients, userIngredient, recipeHistory]) => {
        this.recipe = recipe;
        this.userIngredient = userIngredient;

        ingredients.forEach(ingredient => {
          userIngredient.ingredients.forEach(myIngredient => {
            if (ingredient.id === myIngredient.id) {
              myIngredient.uom = ingredient.uom;
              myIngredient.amount = ingredient.amount;
            }
          });
        });

        this.imageService.download(this.recipe).then(url => {
          if (url) {
            this.recipeImage = url;
          }
        }, () => {});

        this.timesCooked = recipeHistory.timesCooked;
        const date = recipeHistory.lastDateCooked.split('/');
        this.lastDateCooked = new Date(Number.parseInt(date[2]), Number.parseInt(date[1]) - 1, Number.parseInt(date[0]));

        this.ingredients = this.ingredientService.buildRecipeIngredients(recipe.ingredients, ingredients);
        this.recipe.ingredients = this.ingredients;
        this.recipe.count = this.recipeIngredientService.getRecipeCount(recipe, this.userIngredient);
        this.loading = false;
      });
    });
  }

  readFile(event) {
    if (event && event.target && event.target.files[0]) {
      this.imageService.upload(this.recipe.getId(), event.target.files[0]).pipe(takeUntil(this.unsubscribe$)).subscribe(progress => {
        if (typeof progress === 'string') {
          this.recipeImage = progress;
          this.recipeImageProgress = undefined;

          this.recipe.hasImage = true;
          this.recipeService.update(this.recipe.getObject(), this.recipe.getId());
          this.notificationService.setNotification(new SuccessNotification('Image uploaded!'));
        } else {
          this.recipeImageProgress = progress;
        }
      });
    }
  }

  deleteFile(path) {
    this.imageService.deleteFile(path).then(() => {
      this.recipe.hasImage = false;
      this.recipeService.update(this.recipe.getObject(), this.recipe.getId());
      this.recipeImage = undefined;
    });
  }

  deleteRecipe(id) {
    this.validationModalParams = {
      id: id,
      self: this,
      text: 'Are you sure you want to delete recipe ' + this.recipe.name + '?',
      function: this.deleteRecipeEvent
    };
  }

  deleteRecipeEvent(self, id) {
    if (id) {
      self.recipeService.delete(id);
      self.deleteFile(id);
      self.notificationService.setNotification(new SuccessNotification('Recipe deleted!'));
      self.router.navigate(['/recipe/list']);
    }
  }

  setCategoryFilter = (filter) => this.utilService.setListFilter(new CategoryFilter(filter));
  setAuthorFilter = (filter) => this.utilService.setListFilter(new AuthorFilter(filter));

  addIngredients() {
    this.recipeIngredientService.addIngredients(this.recipe, this.userIngredient, this.user.defaultShoppingList);
  }

  removeIngredients() {
    this.recipeIngredientService.removeIngredients(this.recipe, this.userIngredient, this.user.defaultShoppingList);
  }

  onRate(rating, recipe) {
    this.recipeService.rateRecipe(rating, this.user.uid, recipe);
  }
}
