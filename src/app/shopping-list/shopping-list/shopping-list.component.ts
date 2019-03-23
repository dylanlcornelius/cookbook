import { Component, OnInit } from '@angular/core';
import { UserIngredientService } from '../../shopping-list/user-ingredient.service';
import { UserService } from '../../user/user.service';
import { IngredientService } from '../../ingredients/ingredient.service';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredient } from '../user-ingredient.modal';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  loading = true;
  uid: string;
  key: string;
  displayedColumns = ['name', 'pantryQuantity', 'cartQuantity', 'buy'];
  dataSource;

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
      this.uid = user.uid;
      this.userIngredientService.getUserIngredients(user.uid).subscribe(userIngredients => {
        this.key = userIngredients.key;
        this.ingredientService.getIngredients().subscribe(ingredients => {
          ingredients.forEach(ingredient => {
            if (userIngredients && userIngredients.ingredients) {
              userIngredients.ingredients.forEach(myIngredient => {
                if (myIngredient.key === ingredient.key) {
                  myIngredients.push({
                    key: myIngredient.key,
                    name: ingredient.name,
                    pantryQuantity: myIngredient.pantryQuantity,
                    cartQuantity: myIngredient.cartQuantity
                  });
                }
              });
            }
          });
          this.dataSource = new MatTableDataSource(myIngredients);
          // tslint:disable-next-line:triple-equals
          this.dataSource.filterPredicate = (data, filter) => data.cartQuantity != filter;
          this.applyFilter();
          this.loading = false;
        });
      });
    });
  }

  applyFilter() {
    this.dataSource.filter = '0';
  }

  packageData() {
    const userIngredients = [];
    this.dataSource.data.forEach(data => {
      userIngredients.push({key: data.key, pantryQuantity: data.pantryQuantity, cartQuantity: data.cartQuantity});
    });
    return new UserIngredient(this.key, this.uid, userIngredients);
  }

  removeIngredient(key) {
    const data = this.dataSource.data.find(x => x.key === key);
    if (Number(data.cartQuantity) > 0) {
      data.cartQuantity = Number(data.cartQuantity) - 1;
      this.userIngredientService.putUserIngredient(this.packageData());
    }
  }

  addIngredient(key) {
    const data = this.dataSource.data.find(x => x.key === key);
    data.cartQuantity = Number(data.cartQuantity) + 1;
    this.userIngredientService.putUserIngredient(this.packageData());
  }

  addToPantry(key) {
    // add successful popup
    const data = this.dataSource.data.find(x => x.key === key);
    data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
    data.cartQuantity = 0;
    this.userIngredientService.buyUserIngredient(this.packageData(), 1);
    this.applyFilter();
  }

  addAllToPantry() {
    // add validation and successful popup
    this.dataSource.data.forEach(data => {
      data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
      data.cartQuantity = 0;
    });
    this.userIngredientService.buyUserIngredient(this.packageData(), this.dataSource.filteredData.length);
    this.applyFilter();
  }
}
