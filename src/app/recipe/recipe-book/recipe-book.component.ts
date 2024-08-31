import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { HouseholdService } from '@householdService';
import { ImageService } from '@imageService';
import { LoadingService } from '@loadingService';
import { Recipes, RestrictionLabels, TemperatureLabels } from '@recipe';
import {
  CategoryFilter,
  Filter,
  RestrictionFilter,
  TemperatureFilter,
  TypeFilter,
} from '@recipeFilterService';
import { RecipeService } from '@recipeService';
import { User } from '@user';
import { UtilService } from '@utilService';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { fadeInAnimation } from '../../theme/animations';

type Category = {
  name: string;
  filter: CategoryFilter | TypeFilter | RestrictionFilter | TemperatureFilter;
  recipes: Recipes;
};
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
    private configService: ConfigService,
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

            const recipes$ = this.recipeService.get();
            const configs$ = this.configService.get(ConfigType.RECIPE_TYPE);

            combineLatest([recipes$, configs$])
              .pipe(takeUntil(this.unsubscribe$), debounceTime(100))
              .subscribe(([recipes, configs]) => {
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
                        current = {
                          name: category.category,
                          filter: new CategoryFilter(category.category),
                          recipes: [],
                        };
                        categories.push(current);
                      }
                      current.recipes.push(recipe);
                    });

                    const displayType = configs.find(
                      ({ value }) => value === recipe.type
                    )?.displayValue;
                    if (displayType) {
                      let current = categories.find(({ name }) => name === displayType);
                      if (!current) {
                        current = {
                          name: displayType,
                          filter: new TypeFilter(recipe.type),
                          recipes: [],
                        };
                        categories.push(current);
                      }
                      current.recipes.push(recipe);
                    }

                    RestrictionLabels.filter(({ name }) => recipe[name] === true).forEach(
                      ({ displayName, name }) => {
                        let current = categories.find(({ name }) => name === displayName);
                        if (!current) {
                          current = {
                            name: displayName,
                            filter: new RestrictionFilter(name),
                            recipes: [],
                          };
                          categories.push(current);
                        }
                        current.recipes.push(recipe);
                      }
                    );

                    TemperatureLabels.filter(({ name }) => recipe[name] === true).forEach(
                      ({ displayName, name }) => {
                        let current = categories.find(({ name }) => name === displayName);
                        if (!current) {
                          current = {
                            name: displayName,
                            filter: new TemperatureFilter(name),
                            recipes: [],
                          };
                          categories.push(current);
                        }
                        current.recipes.push(recipe);
                      }
                    );
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

  openRecipeList(filter: Filter): void {
    this.utilService.setListFilter(filter);
    this.firebase.logEvent('filter', {
      content_type: 'recipe-list',
      filter_term: filter.value,
    });
  }
}
