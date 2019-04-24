import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../ingredient.service';
import { UserIngredient } from 'src/app/shopping-list/user-ingredient.model';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping-list/user-ingredient.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit {

  loading = true;
  ingredientModalParams;

  displayedColumns = ['name', 'category', 'amount', 'calories', 'pantryQuantity', 'cartQuantity'];
  dataSource = [];
  uid: string;
  id: string;
  userIngredients = [];

  constructor(
    private cookieService: CookieService,
    private ingredientService: IngredientService,
    private userIngredientService: UserIngredientService,
  ) { }

  ngOnInit() {
    this.uid = this.cookieService.get('LoggedIn');
    const myIngredients = [];
    this.userIngredientService.getUserIngredients(this.uid).subscribe(userIngredient => {
      this.id = userIngredient.id;
      this.ingredientService.getIngredients().subscribe(ingredients => {
        ingredients.forEach(ingredient => {
          userIngredient.ingredients.forEach(myIngredient => {
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
  }

  editIngredient(id) {
    let data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.find(x => x.id === id);
    if (!data) {
      this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: 0});
      data = this.userIngredients.find(x => x.id === id);
    }
    this.ingredientModalParams = {
      function: this.editIngredientEvent,
      data: data,
      self: this,
      text: 'Edit pantry quantity for ' + ingredient.name
    };
  }

  editIngredientEvent(self) {
    self.userIngredientService.putUserIngredient(self.packageData(self));
  }

  packageData(self) {
    const data = [];
    self.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient(self.uid, data, self.id);
  }

  removeIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.find(x => x.id === id);
    if (data && Number(data.cartQuantity) > 0 && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.putUserIngredient(this.packageData(this));
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
      this.userIngredientService.putUserIngredient(this.packageData(this));
    }
  }
}
