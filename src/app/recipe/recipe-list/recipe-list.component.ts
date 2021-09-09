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
import { RecipeFilterService, AuthorFilter, CategoryFilter, RatingFilter, SearchFilter, FILTER_TYPE, Filter } from '@recipeFilterService';
import { UserIngredient } from '@userIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;

  user: User;

  filtersList = [];
  searchFilter = '';

  dataSource;
  recipes = [];
  userIngredient: UserIngredient;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private recipeFilterService: RecipeFilterService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private imageService: ImageService,
    private currentUserService: CurrentUserService,
    private utilService: UtilService,
    private recipeIngredientService: RecipeIngredientService
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
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      const recipes$ = this.recipeService.get();
      const ingredients$ = this.ingredientService.get();
      const userIngredient$ = this.userIngredientService.get(this.user.defaultShoppingList);

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
        });

        const filters = this.recipeFilterService.selectedFilters;

        recipes = recipes.sort(this.sortRecipesByName);
        recipes = recipes.sort(this.sortRecipesByImages);
        this.recipes = recipes;
        this.dataSource = new MatTableDataSource(recipes);
        const ratings = [];
        [1, 2, 3].forEach(ratingOption => {
          const rating = ratingOption / 3 * 100;
          let displayValue = '';
          for (let i = 0; i < ratingOption; i++) {
            displayValue += '★';
          }
          
          const checked = filters.find(f => f.type === FILTER_TYPE.RATING && f.value === rating) !== undefined;
          ratings.push({ displayName: `${displayValue} & Up`, name: rating, checked: checked, filter: new RatingFilter(rating) });
        });

        const categories = [];
        const authors = [];
        recipes.forEach(recipe => {
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
        });
        const searchFilter = filters.find(f => f.type === FILTER_TYPE.SEARCH);
        this.searchFilter = searchFilter ? searchFilter.value : '';

        this.dataSource = new MatTableDataSource(recipes);
        this.dataSource.filterPredicate = this.recipeFilterService.recipeFilterPredicate;

        authors.sort(({ name: a }, { name: b }) => a.localeCompare(b));
        categories.sort(({ name: a }, { name: b }) => a.localeCompare(b));
        this.filtersList = [
          { displayName: 'Authors', name: 'author', values: authors },
          { displayName: 'Categories', name: 'categories', values: categories },
          { displayName: 'Ratings', name: 'ratings', values: ratings }
        ];
        this.setSelectedFilterCount();
        this.dataSource.filter = filters;
        this.dataSource.paginator = this.paginator;

        this.loading = false;
      });
    });
  }

  setSelectedFilterCount(): void {
    this.filtersList.forEach(filterList => {
      let i = 0;
      filterList.values.forEach(filter => {
        if (filter.checked) {
          i++;
        }
      });
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

  addIngredients(id: string): void {
    this.recipeIngredientService.addIngredients(this.findRecipe(id), this.recipes, this.userIngredient, this.user.defaultShoppingList);
  }

  removeIngredients(id: string): void {
    this.recipeIngredientService.removeIngredients(this.findRecipe(id), this.recipes, this.userIngredient, this.user.defaultShoppingList);
  }

  onRate(rating: number, recipe: Recipe): void {
    this.recipeService.rateRecipe(rating, this.user.uid, recipe);
  }
}
