import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { IngredientService } from '../ingredient.service';
import { UserIngredient } from 'src/app/shopping-list/user-ingredient.modal';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from 'src/app/user/user.service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit {

  loading = true;
  displayedColumns = ['name', 'category', 'amount', 'calories', 'pantryQuantity', 'cartQuantity'];
  dataSource = [];
  uid: string;
  id: string;
  userIngredients = [];

  constructor(
    private cookieService: CookieService,
    private ingredientService: IngredientService,
    private userService: UserService,
    private userIngredientService: UserIngredientService,
  ) { }

  ngOnInit() {
    const loggedInCookie = this.cookieService.get('LoggedIn');
    const myIngredients = [];
    this.userService.getUser(loggedInCookie).subscribe(user => {
      this.uid = user.uid;
      this.userIngredientService.getUserIngredients(user.uid).subscribe(userIngredients => {
        this.id = userIngredients.id;
        this.ingredientService.getIngredients().subscribe(ingredients => {
          ingredients.forEach(ingredient => {
            userIngredients.ingredients.forEach(myIngredient => {
              if (myIngredient.id === ingredient.id) {
                ingredient.pantryQuantity = myIngredient.pantryQuantity;
                ingredient.cartQuantity = myIngredient.cartQuantity;

                myIngredients.push({
                  id: myIngredient.id,
                  pantryQuantity: myIngredient.pantryQuantity,
                  cartQuantity: myIngredient.cartQuantity
                });
              }
            });
          });
          this.dataSource = ingredients;
          this.userIngredients = myIngredients;
          this.loading = false;
        });
      });
    });
  }

  packageData() {
    const data = [];
    this.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient(this.uid, data, this.id);
  }

  removeIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.find(x => x.id === id);
    if (data && Number(data.cartQuantity) > 0 && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.putUserIngredient(this.packageData());
    }
  }

  addIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.find(x => x.id === id);
    if (ingredient.amount) {
      if (data) {
        data.cartQuantity = Number(data.cartQuantity) + Number(ingredient.amount);
        ingredient.cartQuantity = Number(ingredient.cartQuantity) + Number(ingredient.amount);
      } else {
        this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: Number(ingredient.amount)});
        ingredient.cartQuantity = Number(ingredient.amount);
      }
      this.userIngredientService.putUserIngredient(this.packageData());
    }
    // TODO: else show popup error message
  }
}
