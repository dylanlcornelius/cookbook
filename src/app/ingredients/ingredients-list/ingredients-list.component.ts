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
  key: string;
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
        this.key = userIngredients.key;
        this.ingredientService.getIngredients().subscribe(ingredients => {
          ingredients.forEach(ingredient => {
            if (userIngredients && userIngredients.ingredients) {
              userIngredients.ingredients.forEach(myIngredient => {
                if (myIngredient.key === ingredient.key) {
                  ingredient.pantryQuantity = myIngredient.pantryQuantity;
                  ingredient.cartQuantity = myIngredient.cartQuantity;

                  myIngredients.push({
                    key: myIngredient.key,
                    pantryQuantity: myIngredient.pantryQuantity,
                    cartQuantity: myIngredient.cartQuantity
                  });
                }
              });
            }
          });
          this.dataSource = ingredients;
          this.userIngredients = myIngredients;
          this.loading = false;
        });
      });
    });
  }

  packageData(key) {
    const data = [];
    this.userIngredients.forEach(d => {
      data.push({key: d.key, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient(this.key, this.uid, data);
  }

  removeIngredient(key) {
    const data = this.userIngredients.find(x => x.key === key);
    const ingredient = this.dataSource.find(x => x.key === key);
    if (data && Number(data.cartQuantity) > 0) {
      data.cartQuantity = Number(data.cartQuantity) - 1;
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - 1;
    }
    this.userIngredientService.putUserIngredient(this.packageData(key));
  }

  addIngredient(key) {
    const data = this.userIngredients.find(x => x.key === key);
    const ingredient = this.dataSource.find(x => x.key === key);
    if (data) {
      data.cartQuantity = Number(data.cartQuantity) + 1;
      ingredient.cartQuantity = Number(ingredient.cartQuantity) + 1;
    } else {
      this.userIngredients.push({key: key, pantryQuantity: 0, cartQuantity: 1});
      ingredient.cartQuantity = 1;
    }
    this.userIngredientService.putUserIngredient(this.packageData(key));
  }
}
