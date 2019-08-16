import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '../shared/recipe.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping/shared/user-ingredient.service';
import { UOMConversion } from 'src/app/ingredient/shared/uom.emun';
import { IngredientService } from 'src/app/ingredient/shared/ingredient.service';
import { Notification } from 'src/app/shared/notification-modal/notification.enum';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/util/image.service';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  loading: Boolean = true;
  notificationModalParams;

  filtersList = [];
  searchFilter = '';

  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity', 'cook', 'buy'];
  dataSource: MatTableDataSource<any>;
  uid: string;
  id: string;
  userIngredients;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private uomConversion: UOMConversion,
    private imageService: ImageService,
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.uid = this.cookieService.get('LoggedIn');
    this.recipeService.getRecipes().subscribe(recipes => {
      this.userIngredientService.getUserIngredients(this.uid).subscribe(userIngredient => {
        this.id = userIngredient.id;
        this.userIngredients = userIngredient.ingredients;
        this.ingredientService.getIngredients().subscribe(ingredients => {
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

          this.dataSource = new MatTableDataSource(recipes);
          const categories = [];
          const authors = [];
          recipes.forEach(recipe => {
            recipe.count = this.getRecipeCount(recipe.id);
            this.imageService.downloadFile(recipe.id).then(url => {
              if (url) {
                recipe.image = url;
              }
            });

            recipe.categories.forEach(category => {
              if (categories.find(c => c.name === category.category) === undefined) {
                const checked = filters.find(f => f === category.category) !== undefined;
                categories.push({name: category.category, checked: checked});
              }
            });

            if (authors.find(a => a.name === recipe.author) === undefined && recipe.author !== '') {
              const checked = filters.find(f => f === recipe.author) !== undefined;
              authors.push({name: recipe.author, checked: checked});
            }
          });
          this.dataSource = new MatTableDataSource(recipes);
          this.dataSource.filterPredicate = this.recipeFilterPredicate;

          this.filtersList.push({displayName: 'Authors', name: 'author', values: authors});
          this.filtersList.push({displayName: 'Categories', name: 'categories', values: categories});
          this.setSelectedFilterCount();
          this.dataSource.filter = JSON.stringify(filters);
          this.dataSource.paginator = this.paginator;

          this.loading = false;
        });
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
      filterList['numberOfSelected'] = i;
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

  indentify(index, item) {
    return item.id;
  }

  packageData() {
    const data = [];
    this.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient(this.uid, data, this.id);
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
              this.notificationModalParams = {
                self: self,
                type: Notification.FAILURE,
                text: 'Error calculating measurements!'
              };
            }
          }
        });
      });
      this.userIngredientService.putUserIngredient(this.packageData());
      this.dataSource.data.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });

      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Ingredients removed from pantry'
      };
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
              this.notificationModalParams = {
                self: self,
                type: Notification.FAILURE,
                text: 'Error calculating measurements!'
              };
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

      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Ingredients added to cart'
      };
    }
  }

  recipeFilterPredicate(data, filterList) {
    let hasAll = true;

    JSON.parse(filterList).forEach(filter => {
      let hasFilter = false;

      Object.keys(data).forEach(property => {
        if (data[property] instanceof Array) {
          data[property].forEach(value => {
            if (value.category && value.category.toLowerCase().includes(filter.toLowerCase()) && !hasFilter) {
              hasFilter = true;
            }
          });
        } else if (typeof data[property] === 'string' && data[property].toLowerCase().includes(filter.toLowerCase()) && !hasFilter) {
          hasFilter = true;
        }
      });

      hasAll = hasAll && hasFilter;
    });

    return hasAll;
  }
}
