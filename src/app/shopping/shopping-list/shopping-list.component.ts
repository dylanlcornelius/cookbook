import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { MatTableDataSource } from '@angular/material/table';
import { UserItemService } from '@userItemService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '@notificationService';
import { SuccessNotification } from '@notification';
import { User } from '@user';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  validationModalParams;
  isCompleted = false;

  user: User;

  itemForm: FormGroup;

  id: string;
  ingredientsDataSource;
  ingredients;

  itemsDataSource;
  itemsId: string;

  constructor(
    private formBuilder: FormBuilder,
    private currentUserService: CurrentUserService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private userItemService: UserItemService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.itemForm = this.formBuilder.group({
      'name': [null],
    });

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      this.userIngredientService.get(this.user.defaultShoppingList).pipe(takeUntil(this.unsubscribe$)).subscribe(userIngredients => {
        this.id = userIngredients.id;
        this.ingredientService.get().pipe(takeUntil(this.unsubscribe$)).subscribe(ingredients => {
          const myIngredients = [];

          ingredients.forEach(ingredient => {
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
          });
          this.ingredientsDataSource = new MatTableDataSource(myIngredients);
          this.ingredientsDataSource.filterPredicate = (data, filter) => data.cartQuantity != filter;
          this.applyFilter();
          this.ingredients = ingredients;

          this.userItemService.get(this.user.defaultShoppingList).pipe(takeUntil(this.unsubscribe$)).subscribe(userItems => {
            this.itemsId = userItems.id;
            this.itemsDataSource = new MatTableDataSource(userItems.items);
            this.loading = false;
          });
        });
      });
    });
  }

  applyFilter() {
    this.ingredientsDataSource.filter = '0';
  }

  removeIngredient(id) {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (Number(data.cartQuantity) > 0 && ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.user.defaultShoppingList, this.id);
    }
  }

  addIngredient(id) {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) + Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.user.defaultShoppingList, this.id);
    }
  }

  addIngredientToPantry(id) {
    this.applyFilter();
    const isCompleted = this.ingredientsDataSource.data.filter(x => x.cartQuantity > 0).length === 1;
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    if (Number(data.cartQuantity > 0)) {
      data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
      data.cartQuantity = 0;
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.user.defaultShoppingList, this.id);
      this.userIngredientService.buyUserIngredient(1, isCompleted);
      this.applyFilter();
      this.notificationService.setNotification(new SuccessNotification('Ingredient added!'));
      if (this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.data.length === 0) {
        this.isCompleted = true;
      }
    }
  }

  addItem(form) {
    if (!form.name || !form.name.toString().trim()) {
      return;
    }

    this.userItemService.formattedUpdate([...this.itemsDataSource.data, { name: form.name.toString().trim() }], this.user.defaultShoppingList, this.itemsId);

    this.itemForm.reset();
    this.notificationService.setNotification(new SuccessNotification('Item added!'));
  }

  removeItem(index) {
    this.itemsDataSource.data = this.itemsDataSource.data.filter((_x, i) =>  i !== index);
    this.isCompleted = this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.data.length === 0;

    this.userItemService.formattedUpdate(this.itemsDataSource.data, this.user.defaultShoppingList, this.itemsId);
    this.userItemService.buyUserItem(1, this.isCompleted);
    this.notificationService.setNotification(new SuccessNotification('Item removed!'));
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
    self.userIngredientService.formattedUpdate(self.ingredientsDataSource.data, self.user.defaultShoppingList, self.id);
    self.userIngredientService.buyUserIngredient(self.ingredientsDataSource.filteredData.length, false);

    const itemsCount = self.itemsDataSource.data.length;
    self.itemsDataSource.data = [];
    self.userItemService.formattedUpdate(self.itemsDataSource.data, self.user.defaultShoppingList, self.itemsId);
    self.userItemService.buyUserItem(itemsCount, false);

    self.applyFilter();
    self.notificationService.setNotification(new SuccessNotification('List completed!'));
    self.isCompleted = true;
  }
}
