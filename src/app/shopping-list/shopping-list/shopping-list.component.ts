import { Component, OnInit } from '@angular/core';
import { UserIngredientService } from '../../shopping-list/user-ingredient.service';
import { UserService } from '../../user/user.service';
import { IngredientService } from '../../ingredients/ingredient.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  loading = true;
  displayedColumns = ['name', 'pantryQuantity', 'cartQuantity', 'buy'];
  dataSource = [];

  constructor(
    private cookieService: CookieService,
    private userIngredientService: UserIngredientService,
    private userService: UserService,
    private ingredientService: IngredientService
  ) { }

  ngOnInit() {
    const loggedInCookie = this.cookieService.get('LoggedIn');
    const myIngredients = [];
    this.userService.getUser(loggedInCookie).subscribe(user => {
      this.userIngredientService.getUserIngredients(user.uid).subscribe(userIngredients => {
        this.ingredientService.getIngredients().subscribe(ingredients => {
          ingredients.forEach(ingredient => {
            if (userIngredients && userIngredients.ingredients) {
              userIngredients.ingredients.forEach(myIngredient => {
                if (myIngredient.ingredient === ingredient.key) {
                  myIngredients.push({
                    key: myIngredient.ingredient,
                    name: ingredient.name,
                    pantryQuantity: myIngredient.pantryQuantity,
                    cartQuantity: myIngredient.cartQuantity
                  });
                }
              });
            }
          });
          this.dataSource = myIngredients;
          this.applyFilter();
          this.loading = false;
        });
      });
    });
  }

  applyFilter() {
    this.dataSource = this.dataSource.filter(x => x.cartQuantity > 0);
  }

  removeIngredient(key) {
    const data = this.dataSource.find(x => x.key === key).cartQuantity--;
    this.userIngredientService.putUserIngredient(data);
  }

  addIngredient(key) {
    const data = this.dataSource.find(x => x.key === key).cartQuantity++;
    this.userIngredientService.putUserIngredient(data);
  }

  addToPantry(key) {
    // add successful popup
    const data = this.dataSource.find(x => x.key === key);
    data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
    data.cartQuantity = 0;
    this.userIngredientService.buyUserIngredient(data);
  }

  addAllToPantry() {
    // add validation and successful popup
    this.dataSource.forEach(function(data) {
      data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
      data.cartQuantity = 0;
    });
    this.userIngredientService.buyUserIngredients(this.dataSource);
  }
}
