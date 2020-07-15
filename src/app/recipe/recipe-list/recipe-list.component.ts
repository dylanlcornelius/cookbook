import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RecipeService } from '@recipeService';
import { UserIngredientService } from '@userIngredientService';
import { UOMConversion } from 'src/app/ingredient/shared/uom.emun';
import { IngredientService } from '@ingredientService';
import { NotificationType } from '@notifications';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ImageService } from 'src/app/util/image.service';
import { combineLatest, Subject } from 'rxjs';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { takeUntil } from 'rxjs/operators';
import { Recipe } from '../shared/recipe.model';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { Notification } from 'src/app/shared/notification-modal/notification.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading: Boolean = true;
  notificationModalParams;

  uid: string;
  simplifiedView: boolean;

  filtersList = [];
  searchFilter = '';

  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity', 'cook', 'buy'];
  dataSource;
  id: string;
  userIngredients;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private uomConversion: UOMConversion,
    private imageService: ImageService,
    private currentUserService: CurrentUserService,
    private notificationService: NotificationService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
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
    const recipes$ = this.recipeService.getRecipes();
    const ingredients$ = this.ingredientService.getIngredients();

    combineLatest(user$, recipes$, ingredients$).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, recipes, ingredients]) => {
      this.simplifiedView = user.simplifiedView;
      this.uid = user.uid;

      this.userIngredientService.getUserIngredient(this.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(userIngredient => {
        this.id = userIngredient.id;
        this.userIngredients = userIngredient.ingredients;
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
              }
            });
          });
        });

        const filters = this.recipeService.selectedFilters.slice();

        recipes = recipes.sort(this.sortRecipesByName);
        recipes = recipes.sort(this.sortRecipesByImages);
        this.dataSource = new MatTableDataSource(recipes);
        const ratings = [];
        [1, 2, 3].forEach(ratingOption => {
          const rating = ratingOption / 3 * 100;
          let displayValue = '';
          for (let i = 0; i < ratingOption; i++) {
            displayValue += '★';
          }
          
          const checked = filters.find(f => f === rating) !== undefined;
          ratings.push({displayName: displayValue + ' & Up', name: rating, checked: checked});
        });

        const categories = [];
        const authors = [];
        recipes.forEach(recipe => {
          recipe.count = this.getRecipeCount(recipe.id);
          this.imageService.downloadFile(recipe).then(url => {
            if (url) {
              recipe.image = url;
            }
          }, () => {});

          recipe.categories.forEach(category => {
            if (categories.find(c => c.name === category.category) === undefined) {
              const checked = filters.find(f => f === category.category) !== undefined;
              categories.push({displayName: category.category, name: category.category, checked: checked});
            }
          });

          if (authors.find(a => a.name === recipe.author) === undefined && recipe.author !== '') {
            const checked = filters.find(f => f === recipe.author) !== undefined;
            authors.push({displayName: recipe.author, name: recipe.author, checked: checked});
          }
        });
        this.dataSource = new MatTableDataSource(recipes);
        this.dataSource.filterPredicate = this.recipeFilterPredicate;

        this.filtersList = [
          {displayName: 'Authors', name: 'author', values: authors},
          {displayName: 'Categories', name: 'categories', values: categories},
          {displayName: 'Ratings', name: 'ratings', values: ratings}
        ];
        this.setSelectedFilterCount();
        this.dataSource.filter = JSON.stringify(filters);
        this.dataSource.paginator = this.paginator;

        this.loading = false;
      });
    });
  }

  getRecipeCount(id) {
    let recipeCount;
    let ingredientCount = 0;
    const recipe = this.dataSource.data.find(x => x.id === id);
    if (recipe.ingredients.length === 0 || this.userIngredients.length === 0) {
      return 0;
    }
    recipe.ingredients.forEach(recipeIngredient => {
      this.userIngredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          ingredientCount++;
          const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
          if (value) {
            if (Number(ingredient.pantryQuantity) / Number(value) < recipeCount || recipeCount === undefined) {
              recipeCount = Math.floor(Number(ingredient.pantryQuantity) / Number(value));
            }
          } else {
            recipeCount = '-';
          }
        }
      });
    });

    if (ingredientCount !== recipe.ingredients.length) {
      return 0;
    }

    return recipeCount;
  }

  setSelectedFilterCount() {
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

  setFilters() {
    const filters = this.recipeService.selectedFilters.slice();
    if (this.searchFilter) {
      filters.push(this.searchFilter);
    }
    this.dataSource.filter = JSON.stringify(filters);
  }

  filterSelected(filterValue) {
    if (filterValue.checked) {
      this.recipeService.selectedFilters.push(filterValue.name);
    } else {
      this.recipeService.selectedFilters = this.recipeService.selectedFilters.filter(x => x !== filterValue.name);
    }

    this.setSelectedFilterCount();
    this.setFilters();
  }

  applyFilter(filterValue: string) {
    this.searchFilter = filterValue.trim().toLowerCase();
    this.setFilters();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  indentify(_index, item) {
    return item.id;
  }

  sortRecipesByName(a: Recipe, b: Recipe) {
    return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1;
  }

  sortRecipesByImages(a: Recipe, b: Recipe) {
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

  packageData() {
    const data = [];
    this.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient({
      uid: this.uid, 
      ingredients: data, 
      id: this.id
    });
  }

  removeIngredients(id) {
    const currentRecipe = this.dataSource.data.find(x => x.id === id);
    if (!Number.isNaN(currentRecipe.count) && currentRecipe.count > 0 && currentRecipe.ingredients) {
      currentRecipe.ingredients.forEach(recipeIngredient => {
        this.userIngredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
            if (value) {
              ingredient.pantryQuantity -= Number(value);
            } else {
              this.notificationService.setNotification(new Notification(NotificationType.FAILURE, 'Error calculating measurements!'));
            }
          }
        });
      });
      this.userIngredientService.putUserIngredient(this.packageData());
      this.dataSource.data.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });

      this.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Ingredients removed from pantry'));
    }
  }

  addIngredients(id) {
    const currentRecipe = this.dataSource.data.find(x => x.id === id);
    if (!Number.isNaN(currentRecipe.count) && currentRecipe.ingredients) {
      currentRecipe.ingredients.forEach(recipeIngredient => {
        let hasIngredient = false;
        this.userIngredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
            if (value) {
              ingredient.cartQuantity += ingredient.amount * Math.ceil(Number(value) / ingredient.amount);
            } else {
              this.notificationService.setNotification(new Notification(NotificationType.FAILURE, 'Error calculating measurements!'));
            }
            hasIngredient = true;
          }
        });
        if (!hasIngredient) {
          this.userIngredients.push({
            id: String(recipeIngredient.id),
            pantryQuantity: 0,
            cartQuantity: Number(recipeIngredient.amount)
          });
        }
      });

      this.userIngredientService.putUserIngredient(this.packageData());
      this.dataSource.data.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });

      this.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Ingredients added to cart'));
    }
  }

  recipeFilterPredicate(data, filterList) {
    let hasAll = true;

    JSON.parse(filterList).forEach(filter => {
      let hasFilter = false;

      Object.keys(data).forEach(property => {
        if (data[property] instanceof Array) {
          data[property].forEach(value => {
            if (typeof filter === 'string' && value.category && value.category.toLowerCase().includes(filter.toLowerCase()) && !hasFilter) {
              hasFilter = true;
            }
          });
        } else if (typeof filter === 'string' && typeof data[property] === 'string' && data[property].toLowerCase().includes(filter.toLowerCase()) && !hasFilter) {
          hasFilter = true;
        } else if (property === 'meanRating' && data[property] >= filter && !hasFilter) {
          hasFilter = true;
        }
      });

      hasAll = hasAll && hasFilter;
    });

    return hasAll;
  }

  onRate(rating, recipe) {
    this.recipeService.rateRecipe(rating, this.uid, recipe);
  }
}
