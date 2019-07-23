import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';
import { UOMConversion } from 'src/app/ingredient/uom.emun';
import { IngredientService } from 'src/app/ingredient/ingredient.service';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';
import { UserIngredient } from 'src/app/shopping-list/user-ingredient.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  loading: Boolean = true;
  notificationModalParams;

  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity', 'cook', 'buy'];
  dataSource = [];
  uid: string;
  id: string;
  userIngredients;

  constructor(
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private uomConversion: UOMConversion,
  ) { }

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
          this.dataSource = recipes;
          recipes.forEach(recipe => {
            recipe.count = this.getRecipeCount(recipe.id);
          });
          this.dataSource = recipes;
          this.loading = false;
        });
      });
    });
  }

  getRecipeCount(id) {
    let recipeCount;
    let ingredientCount = 0;
    const recipe = this.dataSource.find(x => x.id === id);
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

  packageData() {
    const data = [];
    this.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient(this.uid, data, this.id);
  }

  removeIngredients(id) {
    const currentRecipe = this.dataSource.find(x => x.id === id);
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
      this.dataSource.forEach(recipe => {
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
    const currentRecipe = this.dataSource.find(x => x.id === id);
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
      this.dataSource.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });

      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Ingredients added to cart'
      };
    }
  }
}
