import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '@recipeService';
import { IngredientService} from '../../ingredient/shared/ingredient.service';
import { NotificationType } from '@notifications';
import { ImageService } from 'src/app/util/image.service';
import { Observable, combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from '../shared/recipe.model';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { Notification } from 'src/app/shared/notification-modal/notification.model';
import { UtilService } from 'src/app/shared/util.service';

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

  uid: string;
  recipe: Recipe;
  ingredients = [];
  recipeImage: string;
  recipeImageProgress;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private currentUserService: CurrentUserService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private utilService: UtilService,
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
    const user$ = this.currentUserService.getCurrentUser();
    const recipe$ = this.recipeService.get(this.route.snapshot.params['id']);
    const ingredients$ = this.ingredientService.get();

    combineLatest([user$, recipe$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, recipe, ingredients]) => {
      this.uid = user.uid;
      this.recipe = recipe;

      this.imageService.download(this.recipe).then(url => {
        if (url) {
          this.recipeImage = url;
        }
      }, () => {});

      this.ingredients = this.ingredientService.buildRecipeIngredients(recipe.ingredients, ingredients);
      this.loading = false;
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
      self.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Recipe Deleted!'));
      self.router.navigate(['/recipe/list']);
    }
  }

  setListFilter = this.utilService.setListFilter;

  onRate(rating, recipe) {
    this.recipeService.rateRecipe(rating, this.uid, recipe);
  }
}
