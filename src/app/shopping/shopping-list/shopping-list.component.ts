import { KeyValue } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Configs } from '@config';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { CurrentUserService } from '@currentUserService';
import { HouseholdService } from '@householdService';
import { Ingredient, Ingredients } from '@ingredient';
import { IngredientService } from '@ingredientService';
import { LoadingService } from '@loadingService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { RecipeIngredient } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';
import { UOM } from '@uoms';
import { User } from '@user';
import { UserIngredients } from '@userIngredient';
import { UserIngredientService } from '@userIngredientService';
import { UserItem, UserItems } from '@userItem';
import { UserItemService } from '@userItemService';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

type DisplayIngredients = {
  [category: string]: Array<
    | {
        id: string;
        userIngredientId: string;
        name: string;
        amount: string;
        uom: UOM;
        altAmount: string;
        altUOM: UOM;
        buyableUOM: Ingredient['buyableUOM'];
        cartQuantity: number;
      }
    | {
        uid: string;
        name: string;
        index: number;
        isItem: boolean;
      }
  >;
};

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;
  isCompleted = false;

  user: User;
  householdId: string;
  userIngredients: UserIngredients;
  userItems: UserItems;
  ingredients: Ingredients;
  categories: Configs;

  ingredientControl = new FormControl();
  filteredIngredients: Observable<Ingredients>;
  displayIngredients?: DisplayIngredients;

  constructor(
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private userIngredientService: UserIngredientService,
    private ingredientService: IngredientService,
    private userItemService: UserItemService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
    private recipeIngredientService: RecipeIngredientService,
    private configService: ConfigService
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

    this.currentUserService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;

        this.householdService
          .getByUser(this.user.uid)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((household) => {
            this.householdId = household.id;

            const userIngredients$ = this.userIngredientService.getByUser(this.householdId);
            const userItems$ = this.userItemService.getByUser(this.householdId);
            const ingredients$ = this.ingredientService.getAll();
            const configs$ = this.configService.getByName(ConfigType.INGREDIENT_CATEGORY);

            combineLatest([userIngredients$, userItems$, ingredients$, configs$])
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe(([userIngredients, userItems, ingredients, configs]) => {
                this.userIngredients = userIngredients;
                this.userItems = userItems;
                this.ingredients = ingredients;
                this.categories = configs;

                this.displayIngredients = userIngredients.reduce(
                  (userIngredientsByCategory, userIngredient) => {
                    const ingredient = ingredients.find(
                      ({ id }) => id === userIngredient.ingredientId
                    );

                    if (ingredient && userIngredient.cartQuantity !== 0) {
                      const category =
                        this.categories.find(({ value }) => value === ingredient.category)
                          ?.displayValue || 'Other';

                      if (!userIngredientsByCategory[category]) {
                        userIngredientsByCategory[category] = [];
                      }

                      userIngredientsByCategory[category].push({
                        id: ingredient.id,
                        userIngredientId: userIngredient.id,
                        name: ingredient.name,
                        amount: ingredient.amount,
                        uom: ingredient.uom,
                        altAmount: ingredient.altAmount,
                        altUOM: ingredient.altUOM,
                        buyableUOM: ingredient.buyableUOM,
                        cartQuantity: userIngredient.cartQuantity,
                      });
                    }

                    return userIngredientsByCategory;
                  },
                  {} as DisplayIngredients
                );

                if (this.userItems.length) {
                  this.displayIngredients['Other'] = (
                    this.displayIngredients['Other'] || []
                  ).concat(this.userItems.map((item, index) => ({ ...item, index, isItem: true })));
                }

                if (!Object.keys(this.displayIngredients).length) {
                  this.displayIngredients = undefined;
                }

                this.filteredIngredients = this.ingredientControl.valueChanges.pipe(
                  startWith(''),
                  map((value) =>
                    this.ingredients.filter(({ name }) =>
                      name.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : '')
                    )
                  )
                );
                this.loading = this.loadingService.set(false);
              });
          });
      });
  }

  categoryOrder = (
    { key: a }: KeyValue<string, any>,
    { key: b }: KeyValue<string, any>
  ): number => {
    return (
      (this.categories.find(({ displayValue }) => displayValue === a)?.order || Infinity) -
      (this.categories.find(({ displayValue }) => displayValue === b)?.order || Infinity)
    );
  };

  addIngredient(ingredient: Ingredient): void {
    // add a single buyable amount to the shopping list
    this.recipeIngredientService.addIngredientsEvent(
      [
        new RecipeIngredient({
          id: ingredient.id,
          quantity: ingredient.buyableUOM === 'volume' ? ingredient.amount : ingredient.altAmount,
          uom: ingredient.buyableUOM === 'volume' ? ingredient.uom : ingredient.altUOM,
        }),
      ],
      this.userIngredients,
      this.ingredients,
      this.user.uid,
      this.householdId
    );
    this.ingredientControl.reset();
  }

  addIngredientToPantry(id: string): void {
    const filteredData = this.userIngredients.filter(({ ingredientId }) => ingredientId !== id);
    this.isCompleted = filteredData.length === 0 && this.userItems.length === 0;

    this.userIngredientService.delete(id);
    this.notificationService.setModal(new SuccessNotification('Ingredient removed!'));
    this.userIngredientService.buyUserIngredient(1, this.isCompleted);
  }

  addItem(item?: string): void {
    const name = item?.toString().trim();
    if (!name) {
      return;
    }

    this.userItemService.create(new UserItem({ uid: this.householdId, name }));
    this.notificationService.setModal(new SuccessNotification('Added to list!'));
    this.ingredientControl.reset();
  }

  removeItem(id: string): void {
    const filteredItems = this.userItems.filter(({ id: itemId }) => itemId !== id);
    this.isCompleted = this.userIngredients.length === 0 && filteredItems.length === 0;

    this.userItemService.delete(id);
    this.notificationService.setModal(new SuccessNotification('Item removed!'));
    this.userItemService.buyUserItem(1, this.isCompleted);
  }

  addAllToPantry(): void {
    this.validationService.setModal({
      text: 'Complete shopping list?',
      function: this.addAllToPantryEvent,
    });
  }

  addAllToPantryEvent = (): void => {
    const totalItems = this.userIngredients.length + this.userItems.length;
    this.isCompleted = true;
    this.userIngredientService.buyUserIngredient(totalItems, this.isCompleted);

    this.userIngredients.map(({ id }) => {
      this.userIngredientService.delete(id);
    });
    this.userItems.map(({ id }) => {
      this.userItemService.delete(id);
    });
  };
}
