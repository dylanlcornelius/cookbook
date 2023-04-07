import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserIngredientService } from '@userIngredientService';
import { IngredientService } from '@ingredientService';
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
import { IngredientCategory } from '@ingredientCategory';
import { KeyValue } from '@angular/common';

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
  userIngredients: UserIngredient[];
  userItem: UserItem;
  ingredients: Ingredient[];
  categories: IngredientCategory[];

  ingredientControl = new FormControl();
  filteredIngredients: Observable<Ingredient[]>;
  displayIngredients: {[category: string]: Array<any>};

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
  ) {
    this.categories = Object.values(IngredientCategory);
  }

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

        combineLatest([userIngredients$, userItems$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredients, userItem, ingredients]) => {
          this.userIngredients = userIngredients;
          this.userItem = userItem;
          this.ingredients = ingredients;
          
          this.displayIngredients = userIngredients.reduce((userIngredientsByCategory, userIngredient) => {
            const ingredient = ingredients.find(({ id }) => id === userIngredient.ingredientId);
            if (ingredient) {
              userIngredient.uom = ingredient.uom;
              userIngredient.amount = ingredient.amount;
            }

            if (ingredient && userIngredient.cartQuantity !== 0) {
              const category = IngredientCategory[ingredient.category] || ingredient.category;
              
              if (!userIngredientsByCategory[category]) {
                userIngredientsByCategory[category] = [];
              }

              userIngredientsByCategory[category].push({
                id: userIngredient.ingredientId,
                name: ingredient.name,
                uom: ingredient.uom,
                pantryQuantity: userIngredient.pantryQuantity,
                cartQuantity: userIngredient.cartQuantity
              });
            }

            return userIngredientsByCategory;
          }, {});

          if (this.userItem.items.length) {
            this.displayIngredients[IngredientCategory.OTHER] = (this.displayIngredients[IngredientCategory.OTHER] || []).concat(this.userItem.items.map((item, index) => ({ ...item, index, isItem: true })));
          }

          if (!Object.keys(this.displayIngredients).length) {
            this.displayIngredients = null;
          }

          this.filteredIngredients = this.ingredientControl.valueChanges.pipe(
            startWith(''),
            map(value => this.ingredients.filter(({ name }) => name.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : '')))
          );
          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  categoryOrder = ({ key: a }: KeyValue<string, any>, {key: b }: KeyValue<string, any>): number => {
    return this.categories.findIndex(value => value === a) - this.categories.findIndex(value => value === b);
  };

  addIngredient(ingredient: Ingredient): void {
    // add a single buyable amount to the shopping list
    ingredient.quantity = this.numberService.toDecimal(ingredient.amount);
    this.recipeIngredientService.addIngredientsEvent([ingredient], this.userIngredients, this.householdId);
    this.ingredientControl.reset();
  }

  addIngredientToPantry(id: string): void {
    const ingredient =  this.userIngredients.find(({ ingredientId }) => ingredientId === id);
    if (Number(ingredient.cartQuantity > 0)) {
      ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
    }
    ingredient.cartQuantity = 0;
    const filteredData = this.userIngredients.filter(({ cartQuantity }) => cartQuantity !== 0);
    this.isCompleted = filteredData.length === 0 && this.userItem.items.length === 0;

    this.userIngredientService.update(this.userIngredients);
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
    const filteredData = this.userIngredients.filter(({ cartQuantity }) => cartQuantity !== 0);
    this.isCompleted = filteredData.length === 0 && this.userItem.items.length === 0;

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
    const filteredData = this.userIngredients.filter(({ cartQuantity }) => cartQuantity !== 0);
    const totalItems = filteredData.length + this.userItem.items.length;

    this.userIngredients.forEach(ingredient => {
      if (Number(ingredient.cartQuantity) > 0) {
        ingredient.pantryQuantity = Number(ingredient.pantryQuantity) + Number(ingredient.cartQuantity);
        ingredient.cartQuantity = 0;
      }
    });

    this.isCompleted = true;
    this.userIngredientService.buyUserIngredient(totalItems, this.isCompleted);

    this.userIngredientService.update(this.userIngredients);
    this.userItemService.formattedUpdate([], this.householdId, this.userItem.id);
  };

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
