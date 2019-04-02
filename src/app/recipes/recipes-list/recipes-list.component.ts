import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';
import { UserIngredient } from 'src/app/shopping-list/user-ingredient.modal';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  loading: Boolean = true;
  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity', 'cook', 'buy'];
  dataSource = [];
  userIngredient: UserIngredient;

  constructor(
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService
  ) { }

  ngOnInit() {
    const uid = this.cookieService.get('LoggedIn');
    const myRecipes = [];
    this.recipeService.getRecipes().subscribe(recipes => {
      this.userIngredientService.getUserIngredients(uid).subscribe(userIngredient => {
        this.userIngredient = userIngredient;
        this.dataSource = recipes;
        recipes.forEach(recipe => {
          recipe.count = this.getRecipeCount(recipe.id);
        });
        this.dataSource = recipes;
        this.loading = false;
      });
    });
  }

  getRecipeCount(id) {
    let recipeCount: number;
    let ingredientCount = 0;
    const recipe = this.dataSource.find(x => x.id === id);
    if (!recipe.ingredients || !(this.userIngredient && this.userIngredient.ingredients)) {
      return 0;
    }
    recipe.ingredients.forEach(recipeIngredient => {
      this.userIngredient.ingredients.forEach(ingredient => {
        if (recipeIngredient.id === ingredient.id) {
          ingredientCount++;
          if (Number(ingredient.pantryQuantity) / Number(recipeIngredient.quantity) < recipeCount || recipeCount === undefined) {
            recipeCount = Number(ingredient.pantryQuantity) / Number(recipeIngredient.quantity);
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
            ingredient.pantryQuantity -= Number(recipeIngredient.quantity);
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
      const myIngredients = this.userIngredient;
      currentRecipe.ingredients.forEach(recipeIngredient => {
        let hasIngredient = false;
        myIngredients.ingredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            ingredient.cartQuantity += Number(recipeIngredient.quantity);
            hasIngredient = true;
          }
        });
        if (!hasIngredient) {
          myIngredients.ingredients.push({
            id: String(recipeIngredient.id),
            pantryQuantity: 0,
            cartQuantity: Number(recipeIngredient.quantity)
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
