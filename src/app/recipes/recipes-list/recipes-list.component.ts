import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';
import { UserIngredient } from 'src/app/shopping-list/user-ingredient.modal';
import { UOM, UOMConversion } from 'src/app/ingredients/uom.emun';
import { IngredientService } from 'src/app/ingredients/ingredient.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css']
})
export class RecipesListComponent implements OnInit {

  loading: Boolean = true;
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
    const myRecipes = [];
    this.recipeService.getRecipes().subscribe(recipes => {
      this.userIngredientService.getUserIngredients(uid).subscribe(userIngredient => {
        this.userIngredient = userIngredient;
        this.ingredientService.getIngredients().subscribe(ingredients => {
          ingredients.forEach(ingredient => {
            if (userIngredient.ingredients) {
              userIngredient.ingredients.forEach(myIngredient => {
                if (ingredient.id === myIngredient.id) {
                  myIngredient.uom = ingredient.uom;
                }
              });
            }
          });
          console.log(this.userIngredient);
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

  // do conversions to buyable amounts on add and remove
  // how to tick up to buyable amount?
  removeIngredients(id) {
    const currentRecipe = this.dataSource.find(x => x.id === id);
    console.log(currentRecipe);
    if (currentRecipe.count > 0 && currentRecipe.ingredients) {
      currentRecipe.ingredients.forEach(recipeIngredient => {
        this.userIngredient.ingredients.forEach(ingredient => {
          if (recipeIngredient.id === ingredient.id) {
            console.log('here');
            const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
            ingredient.pantryQuantity -= value;
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
            console.log('hi');
            const value = this.uomConversion.convert(recipeIngredient.uom, ingredient.uom, Number(recipeIngredient.quantity));
            console.log(value);
            ingredient.cartQuantity += value;
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
