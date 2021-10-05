import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { MatTableDataSource } from '@angular/material/table';
import { UserItemService } from '@userItemService';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User } from '@user';
import { Validation } from '@validation';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  isCompleted = false;

  user: User;
  householdId: string;

  itemForm: FormGroup;

  id: string;
  ingredientsDataSource;
  ingredients;

  itemsDataSource;
  itemsId: string;

  constructor(
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private userItemService: UserItemService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private tutorialService: TutorialService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.loading = this.loadingService.set(true);

    this.itemForm = this.formBuilder.group({
      'name': [null],
    });

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      
      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const userIngredients$ = this.userIngredientService.get(this.householdId);
        const userItems$ = this.userItemService.get(this.householdId);
        const ingredients$ = this.ingredientService.get();

        combineLatest([userIngredients$, userItems$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredients, userItems, ingredients]) => {
          this.id = userIngredients.id;

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

          this.itemsId = userItems.id;
          this.itemsDataSource = new MatTableDataSource(userItems.items);
          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  applyFilter(): void {
    this.ingredientsDataSource.filter = '0';
  }

  removeIngredient(id: string): void {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (Number(data.cartQuantity) > 0 && ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.id);
    }
  }

  addIngredient(id: string): void {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) + Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.id);
    }
  }

  addIngredientToPantry(id: string): void {
    this.applyFilter();
    const isCompleted = this.ingredientsDataSource.data.filter(x => x.cartQuantity > 0).length === 1;
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    if (Number(data.cartQuantity > 0)) {
      data.pantryQuantity = Number(data.pantryQuantity) + Number(data.cartQuantity);
      data.cartQuantity = 0;
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.id);
      this.userIngredientService.buyUserIngredient(1, isCompleted);
      this.applyFilter();
      this.notificationService.setModal(new SuccessNotification('Ingredient added!'));
      if (this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.data.length === 0) {
        this.isCompleted = true;
      }
    }
  }

  addItem(form: any): void {
    if (!form.name || !form.name.toString().trim()) {
      return;
    }

    this.userItemService.formattedUpdate([...this.itemsDataSource.data, { name: form.name.toString().trim() }], this.householdId, this.itemsId);

    this.itemForm.reset();
    this.notificationService.setModal(new SuccessNotification('Item added!'));
  }

  removeItem(index: number): void {
    this.itemsDataSource.data = this.itemsDataSource.data.filter((_x, i) =>  i !== index);
    this.isCompleted = this.ingredientsDataSource.filteredData.length === 0 && this.itemsDataSource.data.length === 0;

    this.userItemService.formattedUpdate(this.itemsDataSource.data, this.householdId, this.itemsId);
    this.userItemService.buyUserItem(1, this.isCompleted);
    this.notificationService.setModal(new SuccessNotification('Item removed!'));
  }

  addAllToPantry(): void {
    this.validationService.setModal(new Validation(
      'Complete shopping list?',
      this.addAllToPantryEvent
    ));
  }

  addAllToPantryEvent = (): void => {
    this.ingredientsDataSource.data.forEach(ingredient => {
      if (Number(ingredient.cartQuantity) > 0) {
        ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
        ingredient.cartQuantity = 0;
      }
    });
    this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.id);
    this.userIngredientService.buyUserIngredient(this.ingredientsDataSource.filteredData.length, false);

    const itemsCount = this.itemsDataSource.data.length;
    this.itemsDataSource.data = [];
    this.userItemService.formattedUpdate(this.itemsDataSource.data, this.householdId, this.itemsId);
    this.userItemService.buyUserItem(itemsCount, false);

    this.applyFilter();
    this.notificationService.setModal(new SuccessNotification('List completed!'));
    this.isCompleted = true;
  };

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
