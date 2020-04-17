import { Component, OnInit } from '@angular/core';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredient } from '../shared/user-ingredient.model';
import { MatTableDataSource } from '@angular/material/table';
import { Notification } from '@notifications';
import { UserItemService } from '@userItemService';
import { ItemService } from '@itemService';
import { UserItem } from '../shared/user-item.model';
import { UserService } from '@userService';

// TODO: icons for notification modal
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit {
  loading = true;
  validationModalParams;
  notificationModalParams;
  isCompleted = false;

  uid: string;
  simplifiedView: boolean;

  id: string;
  displayedColumns = ['name', 'pantryQuantity', 'cartQuantity', 'buy'];
  ingredientsDataSource;
  ingredients;

  itemsDisplayedColumns = ['name', 'cartQuantity', 'buy'];
  itemsDataSource;
  itemsId: string;

  constructor(
    private cookieService: CookieService,
    private userService: UserService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private userItemService: UserItemService,
    private itemService: ItemService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.simplifiedView = user.simplifiedView;
    });

    this.uid = this.cookieService.get('LoggedIn');
    const myIngredients = [];
    const myItems = [];
    this.userIngredientService.getUserIngredients(this.uid).subscribe(userIngredients => {
      this.id = userIngredients.id;
      this.ingredientService.getIngredients().subscribe(ingredients => {
        ingredients.forEach(ingredient => {
          if (userIngredients && userIngredients.ingredients) {
            userIngredients.ingredients.forEach(myIngredient => {
              if (myIngredient.id === ingredient.id) {
                myIngredients.push({
                  id: myIngredient.id,
                  name: ingredient.name,
                  uom: ingredient.uom,
                  pantryQuantity: myIngredient.pantryQuantity,
                  cartQuantity: myIngredient.cartQuantity
                });
              }
            });
          }
        });
        this.ingredientsDataSource = new MatTableDataSource(myIngredients);
        // tslint:disable-next-line:triple-equals
        this.ingredientsDataSource.filterPredicate = (data, filter) => data.cartQuantity != filter;
        this.ingredients = ingredients;

        this.userItemService.getUserItems(this.uid).subscribe(userItems => {
          this.itemsId = userItems.id;
          this.itemService.getItems().subscribe(items => {
            items.forEach(item => {
              if (userItems && userItems.items) {
                userItems.items.forEach(myItem => {
                  if (myItem.id === item.id) {
                    myItems.push({
                      id: myItem.id,
                      name: item.name,
                      cartQuantity: myItem.cartQuantity
                    });
                  }
                });
              }
            });
            this.itemsDataSource = new MatTableDataSource(myItems);
            // tslint:disable-next-line: triple-equals
            this.itemsDataSource.filterPredicate = (data, filter) => data.cartQuantity != filter;
            this.applyFilter();
            this.loading = false;
          });
        });
      });
    });
  }

  applyFilter() {
    this.ingredientsDataSource.filter = '0';
    this.itemsDataSource.filter = '0';
  }

  packageIngredientData() {
    const userIngredients = [];
    this.ingredientsDataSource.data.forEach(data => {
      userIngredients.push({id: data.id, pantryQuantity: data.pantryQuantity, cartQuantity: data.cartQuantity});
    });
    return new UserIngredient(this.uid, userIngredients, this.id);
  }

  removeIngredient(id) {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (Number(data.cartQuantity) > 0 && ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.putUserIngredient(this.packageIngredientData());
    }
  }

  addIngredient(id) {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) + Number(ingredient.amount);
      this.userIngredientService.putUserIngredient(this.packageIngredientData());
    }
  }

  addIngredientToPantry(id) {
    this.applyFilter();
    const isCompleted = this.ingredientsDataSource.data.filter(x => x.cartQuantity > 0).length === 1;
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    if (Number(data.cartQuantity > 0)) {
      data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
      data.cartQuantity = 0;
      this.userIngredientService.buyUserIngredient(this.packageIngredientData(), 1, isCompleted);
      this.applyFilter();
      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Ingredient added!'
      };
      if (this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.filteredData.length === 0) {
        this.isCompleted = true;
      }
    }
  }

  packageItemData() {
    const userItems = [];
    this.itemsDataSource.data.forEach(data => {
      userItems.push({id: data.id, cartQuantity: data.cartQuantity});
    });
    return new UserItem(this.uid, userItems, this.itemsId);
  }

  removeItem(id) {
    const data = this.itemsDataSource.data.find(x => x.id === id);
    if (Number(data.cartQuantity) > 0) {
      data.cartQuantity = Number(data.cartQuantity) - 1;
      this.userItemService.putUserItem(this.packageItemData());
    }
  }

  addItem(id) {
    const data = this.itemsDataSource.data.find(x => x.id === id);
    data.cartQuantity = Number(data.cartQuantity) + 1;
    this.userItemService.putUserItem(this.packageItemData());
  }

  removeItemFromCart(id) {
    this.applyFilter();
    const isCompleted = this.itemsDataSource.data.filter(x => x.cartQuantity > 0).length === 1;
    const data = this.itemsDataSource.data.find(x => x.id === id);
    if (Number(data.cartQuantity > 0)) {
      data.cartQuantity = 0;
      this.userItemService.buyUserItem(this.packageItemData(), 1, isCompleted);
      this.applyFilter();
      this.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        text: 'Item removed!'
      };
      if (this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.filteredData.length === 0) {
        this.isCompleted = true;
      }
    }
  }

  addAllToPantry() {
    this.validationModalParams = {
      function: this.addAllToPantryEvent,
      self: this,
      text: 'Complete shopping list?'
    };
  }

  addAllToPantryEvent(self) {
    self.ingredientsDataSource.data.forEach(ingredient => {
      if (Number(ingredient.cartQuantity) > 0) {
        ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
        ingredient.cartQuantity = 0;
      }
    });
    self.userIngredientService.buyUserIngredient(self.packageIngredientData(), self.ingredientsDataSource.filteredData.length, false);

    self.itemsDataSource.data.forEach(item => {
      if (Number(item.cartQuantity) > 0) {
        item.cartQuantity = 0;
      }
    });
    self.userItemService.buyUserItem(self.packageItemData(), self.itemsDataSource.filteredData.length, false);

    self.applyFilter();
    self.notificationModalParams = {
      self: self,
      type: Notification.SUCCESS,
      text: 'Shopping list completed!'
    };
    self.isCompleted = true;
  }
}
