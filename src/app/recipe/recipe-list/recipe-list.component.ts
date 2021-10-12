import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RecipeService } from '@recipeService';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ImageService } from '@imageService';
import { combineLatest, Subject } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from '@recipe';
import { UtilService } from '@utilService';
import { User } from '@user';
import { RecipeFilterService, AuthorFilter, CategoryFilter, RatingFilter, SearchFilter, FILTER_TYPE, Filter, StatusFilter } from '@recipeFilterService';
import { UserIngredient } from '@userIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;

  user: User;
  householdId: string;

  filtersList = [];
  searchFilter = '';

  dataSource;
  recipes = [];
  userIngredient: UserIngredient;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private loadingService: LoadingService,
    private recipeService: RecipeService,
    private recipeFilterService: RecipeFilterService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private imageService: ImageService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private utilService: UtilService,
    private recipeIngredientService: RecipeIngredientService,
    private tutorialService: TutorialService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

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

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const recipes$ = this.recipeService.get();
        const ingredients$ = this.ingredientService.get();
        const userIngredient$ = this.userIngredientService.get(this.householdId);

        combineLatest([recipes$, ingredients$, userIngredient$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipes, ingredients, userIngredient]) => {
          this.userIngredient = userIngredient;
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

          // account for deleted ingredients
          recipes.forEach(recipe => {
            recipe.ingredients.forEach(recipeIngredient => {
              if (!recipeIngredient.name) {
                recipeIngredient.name = null;
              }
            });

            recipe.hasAuthorPermission = this.householdService.hasAuthorPermission(household, this.user, recipe);
          });

          const filters = this.recipeFilterService.selectedFilters;

          this.recipes = recipes
            .filter(recipe => this.householdService.hasUserPermission(household, this.user, recipe))
            .sort(this.sortRecipesByName)
            .sort(this.sortRecipesByImages);
          this.dataSource = new MatTableDataSource(recipes);
          const ratings = [];
          [0, 1, 2, 3].forEach(ratingOption => {
            const rating = ratingOption / 3 * 100;
            let displayValue = '';
            for (let i = 0; i < ratingOption; i++) {
              displayValue += '★';
            }
            
            const checked = filters.find(f => f.type === FILTER_TYPE.RATING && f.value === rating) !== undefined;
            ratings.push({ displayName: `${displayValue}`, name: rating, checked: checked, filter: new RatingFilter(rating) });
          });

          const categories = [];
          const authors = [];
          const statuses = [];
          this.recipes.forEach(recipe => {
            recipe.count = this.recipeIngredientService.getRecipeCount(recipe, recipes, this.userIngredient);
            this.imageService.download(recipe).then(url => {
              if (url) {
                recipe.image = url;
              }
            }, () => {});

            recipe.categories.forEach(({ category }) => {
              if (categories.find(c => c.name === category) === undefined) {
                const checked = filters.find(f => f.type === FILTER_TYPE.CATEGORY && f.value === category) !== undefined;
                categories.push({ displayName: category, name: category, checked: checked, filter: new CategoryFilter(category) });
              }
            });

            if (authors.find(a => a.name === recipe.author) === undefined && recipe.author !== '') {
              const checked = filters.find(f => f.type === FILTER_TYPE.AUTHOR && f.value === recipe.author) !== undefined;
              authors.push({ displayName: recipe.author, name: recipe.author, checked: checked, filter: new AuthorFilter(recipe.author) });
            }

            if (statuses.find(s => s.name === recipe.status) === undefined) {
              const checked = filters.find(f => f.type === FILTER_TYPE.STATUS && f.value === recipe.status) !== undefined;
              statuses.push({ displayName: recipe.status.replace(/\b\w/g, l => l.toUpperCase()), name: recipe.status, checked: checked, filter: new StatusFilter(recipe.status) });
            }
          });
          const searchFilter = filters.find(f => f.type === FILTER_TYPE.SEARCH);
          this.searchFilter = searchFilter ? searchFilter.value : '';

          this.dataSource = new MatTableDataSource(this.recipes);
          this.dataSource.filterPredicate = this.recipeFilterService.recipeFilterPredicate;

          authors.sort(({ name: a }, { name: b }) => a.localeCompare(b));
          categories.sort(({ name: a }, { name: b }) => a.localeCompare(b));
          statuses.sort(({ name: a }, { name: b }) => a.localeCompare(b));

          this.breakpointObserver.observe('(min-width: 768px)').pipe(takeUntil(this.unsubscribe$)).subscribe(({ matches }) => {
            if (matches) {
              this.filtersList = [
                { displayName: 'Authors', name: 'author', values: authors },
                { displayName: 'Categories', name: 'categories', values: categories },
                { displayName: 'Ratings', name: 'ratings', values: ratings },
                { displayName: 'Statuses', name: 'statuses', values: statuses },
              ];
            } else {
              this.filtersList = [
                { displayName: 'Categories', name: 'categories', values: categories },
                {
                  icon: 'more_vert',
                  values: [
                    { displayName: 'Authors', name: 'author', values: authors },
                    { displayName: 'Ratings', name: 'ratings', values: ratings },
                    { displayName: 'Statuses', name: 'statuses', values: statuses },
                  ]
                }
              ];
            }
            this.setSelectedFilterCount();
            this.dataSource.filter = this.recipeFilterService.selectedFilters;
            this.dataSource.paginator = this.paginator;
            this.loading = this.loadingService.set(false);
          });
        });
      });
    });
  }

  setSelectedFilterCount(): void {
    this.filtersList.forEach(filterList => {
      let i = 0;
      if (!filterList.icon) {
        filterList.values.forEach(filter => {
          if (filter.checked) {
            i++;
          }
        });
      } else {
        filterList.values.forEach(subFilterList => {
          subFilterList.values.forEach(subFilter => {
            if (subFilter.checked) {
              i++;
            }
          });
        });
      }
      filterList.numberOfSelected = i;
    });
  }

  setFilters(): void {
    this.recipeFilterService.selectedFilters = this.recipeFilterService.selectedFilters.filter(f => FILTER_TYPE.SEARCH !== f.type);
    if (this.searchFilter) {
      this.recipeFilterService.selectedFilters.push(new SearchFilter(this.searchFilter));
    }
    this.dataSource.filter = this.recipeFilterService.selectedFilters;
  }

  filterSelected(selectedFilter: { filter: Filter, checked: boolean, name: string }): void {
  if (selectedFilter.checked) {
      this.recipeFilterService.selectedFilters.push(selectedFilter.filter);
    } else {
      this.recipeFilterService.selectedFilters = this.recipeFilterService.selectedFilters.filter(f => selectedFilter.filter.type !== f.type && selectedFilter.filter.value != f.value);
    }

    this.setSelectedFilterCount();
    this.setFilters();
  }

  applySearchFilter(filterValue: string): void {
    this.searchFilter = filterValue.trim().toLowerCase();
    this.setFilters();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setCategoryFilter = (filter: Filter): void => this.utilService.setListFilter(new CategoryFilter(filter));

  sortRecipesByName(a: Recipe, b: Recipe): number {
    return a.name.localeCompare(b.name);
  }

  sortRecipesByImages(a: Recipe, b: Recipe): number {
    if (a.hasImage && b.hasImage) {
      return 0;
    }
    
    if (a.hasImage) {
      return -1;
    }

    if (b.hasImage) {
      return 1;
    }

    return 0;
  }

  findRecipe(id: string): Recipe {
    return this.dataSource.data.find(x => x.id === id);
  }

  changeStatus = (recipe: Recipe): void => this.recipeService.changeStatus(recipe);

  addIngredients(id: string): void {
    this.recipeIngredientService.addIngredients(this.findRecipe(id), this.recipes, this.userIngredient, this.householdId);
  }

  removeIngredients(id: string): void {
    this.recipeIngredientService.removeIngredients(this.findRecipe(id), this.recipes, this.userIngredient, this.user.uid, this.householdId);
  }

  onRate(rating: number, recipe: Recipe): void {
    this.recipeService.rateRecipe(rating, this.user.uid, recipe);
  }

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
