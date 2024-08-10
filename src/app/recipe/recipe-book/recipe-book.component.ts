import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { HouseholdService } from '@householdService';
import { ImageService } from '@imageService';
import { LoadingService } from '@loadingService';
import { Recipes } from '@recipe';
import { CategoryFilter } from '@recipeFilterService';
import { RecipeService } from '@recipeService';
import { User } from '@user';
import { UtilService } from '@utilService';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fadeInAnimation } from '../../theme/animations';

type Category = { name: string; recipes: Recipes };
type Categories = Category[];

@Component({
  selector: 'app-recipe-book',
  templateUrl: './recipe-book.component.html',
  styleUrls: ['./recipe-book.component.scss'],
  animations: [fadeInAnimation],
})
export class RecipeBookComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;

  user: User;
  householdId: string;

  categories: Categories = [];

  constructor(
    private loadingService: LoadingService,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private utilService: UtilService,
    private firebase: FirebaseService
  ) {}

  identify = this.utilService.identify;

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.loading = this.loadingService.set(true);

    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        this.user = user;

        this.householdService
          .get(this.user.uid)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe(household => {
            this.householdId = household.id;

            this.recipeService
              .get()
              .pipe(takeUntil(this.unsubscribe$), debounceTime(100))
              .subscribe(recipes => {
                const categories: Categories = [];

                recipes
                  .filter(
                    recipe =>
                      this.householdService.hasUserPermission(household, this.user, recipe) &&
                      !!recipe.hasImage
                  )
                  .forEach(recipe => {
                    this.imageService.download(recipe).then(
                      url => {
                        if (url) {
                          recipe.image = url;
                        }
                      },
                      () => {}
                    );

                    recipe.categories.forEach(category => {
                      if (!category?.category) {
                        return;
                      }
                      let current = categories.find(({ name }) => name === category?.category);

                      if (!current) {
                        current = { name: category.category, recipes: [] };
                        categories.push(current);
                      }
                      current.recipes.push(recipe);
                    });
                  });

                this.categories = categories
                  .filter(({ recipes }) => recipes.length >= 4)
                  .map(category => {
                    const categoryRecipes = category.recipes;
                    const selectedRecipes = [];

                    for (let i = 0; i < 4; i++) {
                      const random = Math.floor(Math.random() * categoryRecipes.length);
                      selectedRecipes.push(categoryRecipes[random]);
                      categoryRecipes.splice(random, 1);
                    }

                    category.recipes = selectedRecipes;
                    return category;
                  })
                  .filter(({ recipes }) => recipes.length >= 4)
                  .sort(this.sortCategoriesByName);
                this.loading = this.loadingService.set(false);
              });
          });
      });
  }

  sortCategoriesByName(a: Category, b: Category): number {
    return a.name.localeCompare(b.name);
  }

  openRecipeList(category: Category['name']): void {
    this.utilService.setListFilter(new CategoryFilter(category));
    this.firebase.logEvent('select_content', {
      content_type: 'recipe-list',
      item_name: category,
    });
  }
}
