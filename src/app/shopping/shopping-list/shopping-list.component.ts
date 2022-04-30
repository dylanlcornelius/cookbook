import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
import { MatTableDataSource } from '@angular/material/table';
import { UserItemService } from '@userItemService';
import { FormControl } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User } from '@user';
import { Validation } from '@validation';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { Ingredient } from '@ingredient';
import { UserIngredient } from '@userIngredient';
import { UserItem } from '@userItem';
import { RecipeIngredientService } from '@recipeIngredientService';
import { NumberService } from '@numberService';

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
  userIngredient: UserIngredient;
  userItem: UserItem;
  ingredients: Ingredient[];

  ingredientsDataSource;
  itemsDataSource;

  ingredientControl = new FormControl();
  filteredIngredients: Observable<Ingredient[]>;

  constructor(
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private userItemService: UserItemService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private tutorialService: TutorialService,
    private recipeIngredientService: RecipeIngredientService,
    private numberService: NumberService,
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

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      
      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const userIngredients$ = this.userIngredientService.get(this.householdId);
        const userItems$ = this.userItemService.get(this.householdId);
        const ingredients$ = this.ingredientService.get();

        combineLatest([userIngredients$, userItems$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredient, userItem, ingredients]) => {
          const myIngredients = [];
          ingredients.forEach(ingredient => {
            userIngredient.ingredients.forEach(myIngredient => {
              if (myIngredient.id === ingredient.id) {
                myIngredient.uom = ingredient.uom;
                myIngredient.amount = ingredient.amount;

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
          this.userIngredient = userIngredient;
          this.userItem = userItem;
          this.ingredients = ingredients;

          this.ingredientsDataSource = new MatTableDataSource(myIngredients);
          this.ingredientsDataSource.filterPredicate = (data, filter) => data.cartQuantity != filter;
          this.applyFilter();

          this.itemsDataSource = new MatTableDataSource(userItem.items);
          
          this.filteredIngredients = this.ingredientControl.valueChanges.pipe(
            startWith(''),
            map(value => this.ingredients.filter(({ name }) => name.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : '')))
          );
          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  applyFilter(): void {
    this.ingredientsDataSource.filter = '0';
  }

  /**
   * UNUSED - maybe add a remove button to shopping list
   * @param id 
   */
  removeIngredient(id: string): void {
    const data = this.ingredientsDataSource.data.find(x => x.id === id);
    const ingredient = this.ingredients.find(x => x.id === id);
    if (Number(data.cartQuantity) > 0 && ingredient && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.userIngredient.id);
    }
  }

  addIngredient(ingredient: Ingredient): void {
    // add a single buyable amount to the shopping list
    ingredient.quantity = this.numberService.toDecimal(ingredient.amount);
    this.recipeIngredientService.addIngredientsEvent([ingredient], this.userIngredient, this.householdId);
    this.ingredientControl.reset();
  }

  addIngredientToPantry(id: string): void {
    const ingredient =  this.ingredientsDataSource.data.find(x => x.id === id);
    if (Number(ingredient.cartQuantity > 0)) {
      ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
    }
    ingredient.cartQuantity = 0;
    this.applyFilter();
    this.isCompleted = this.ingredientsDataSource.filteredData.length === 0 && this.userItem.items.length === 0;

    this.userIngredientService.formattedUpdate(this.ingredientsDataSource.data, this.householdId, this.userIngredient.id);
    this.notificationService.setModal(new SuccessNotification('Ingredient removed!'));
    this.userIngredientService.buyUserIngredient(1, this.isCompleted);
  }

  addItem(item: string): void {
    const name = item?.toString().trim();
    if (!name) {
      return;
    }

    this.userItemService.formattedUpdate([...this.userItem.items, { name }], this.householdId, this.userItem.id);
    this.notificationService.setModal(new SuccessNotification('Added to list!'));
    this.ingredientControl.reset();
  }

  removeItem(index: number): void {
    this.userItem.items = this.userItem.items.filter((_x, i) =>  i !== index);
    this.isCompleted = this.ingredientsDataSource.filteredData.length === 0 && this.userItem.items.length === 0;

    this.userItemService.formattedUpdate(this.userItem.items, this.householdId, this.userItem.id);
    this.notificationService.setModal(new SuccessNotification('Item removed!'));
    this.userItemService.buyUserItem(1, this.isCompleted);
  }

  addAllToPantry(): void {
    this.validationService.setModal(new Validation(
      'Complete shopping list?',
      this.addAllToPantryEvent
    ));
  }

  addAllToPantryEvent = (): void => {
    this.userIngredient.ingredients.forEach(ingredient => {
      if (Number(ingredient.cartQuantity) > 0) {
        ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
        ingredient.cartQuantity = 0;
      }
    });

    const totalItems = this.ingredientsDataSource.filteredData.length + this.userItem.items.length;
    this.isCompleted = true;
    this.userIngredientService.buyUserIngredient(totalItems, this.isCompleted);

    this.userIngredientService.formattedUpdate(this.userIngredient.ingredients, this.householdId, this.userIngredient.id);
    this.userItemService.formattedUpdate([], this.householdId, this.userItem.id);
  };

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
