import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';
import { UOMConversion } from 'src/app/ingredients/uom.emun';
import { IngredientService } from 'src/app/ingredients/ingredient.service';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  loading: Boolean = true;
  notificationModalParams;

  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity', 'cook', 'buy'];
  dataSource = [];
  userIngredient;

  constructor(
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private uomConversion: UOMConversion,
  ) { }

  ngOnInit() {
    const uid = this.cookieService.get('LoggedIn');
    this.recipeService.getRecipes().subscribe(recipes => {
      this.userIngredientService.getUserIngredients(uid).subscribe(userIngredient => {
        this.userIngredient = userIngredient;
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
    let recipeCount: number;
    let ingredientCount = 0;
    const recipe = this.dataSource.find(x => x.id === id);
    if (recipe.ingredients.length === 0 || this.userIngredient.ingredients.length === 0) {
      return 0;
    }
    recipe.ingredients.forEach(recipeIngredient => {
      this.userIngredient.ingredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          ingredientCount++;
          const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
          if (value) {
            if (Number(ingredient.pantryQuantity) / Number(value) < recipeCount || recipeCount === undefined) {
              recipeCount = Number(ingredient.pantryQuantity) / Number(value);
            }
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

    if (ingredientCount !== recipe.ingredients.length) {
      return 0;
    }

    return Math.floor(recipeCount);
  }

  removeIngredients(id) {
    const currentRecipe = this.dataSource.find(x => x.id === id);
    if (currentRecipe.count > 0 && currentRecipe.ingredients) {
      currentRecipe.ingredients.forEach(recipeIngredient => {
        this.userIngredient.ingredients.forEach(ingredient => {
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
      this.userIngredientService.putUserIngredient(this.userIngredient);
      this.dataSource.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });
    }
  }

  addIngredients(id) {
    const currentRecipe = this.dataSource.find(x => x.id === id);
    if (currentRecipe.ingredients) {
      currentRecipe.ingredients.forEach(recipeIngredient => {
        let hasIngredient = false;
        this.userIngredient.ingredients.forEach(ingredient => {
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
          this.userIngredient.ingredients.push({
            id: String(recipeIngredient.id),
            pantryQuantity: 0,
            cartQuantity: Number(recipeIngredient.amount)
          });
        }
      });
      this.userIngredientService.putUserIngredient(this.userIngredient);
      this.dataSource.forEach(recipe => {
        recipe.count = this.getRecipeCount(recipe.id);
      });
    }
  }
}
