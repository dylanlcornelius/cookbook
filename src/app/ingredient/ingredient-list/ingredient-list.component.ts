import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IngredientService } from '@ingredientService';
import { UserIngredientService } from '@userIngredientService';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subject } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { takeUntil } from 'rxjs/operators';
import { User } from '@user';
import { Ingredient } from '@ingredient';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { NumberService } from '@numberService';
import { IngredientCategory } from '@ingredientCategory';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  ingredientModalParams;

  displayedColumns = ['name', 'category', 'amount', 'calories', 'pantryQuantity', 'cartQuantity'];
  dataSource;

  userIngredients = [];

  user: User;
  householdId: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private ingredientService: IngredientService,
    private userIngredientService: UserIngredientService,
    private numberService: NumberService,
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
    
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const userIngredients$ = this.userIngredientService.get(this.householdId);
        const ingredients$ = this.ingredientService.get();
        combineLatest([userIngredients$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredients, ingredients]) => {
          ingredients.forEach(ingredient => {
            ingredient.category = IngredientCategory[ingredient.category] || ingredient.category;
            ingredient.amount = this.numberService.toFormattedFraction(ingredient.amount);

            userIngredients.forEach(userIngredient => {
              if (userIngredient.ingredientId === ingredient.id) {
                ingredient.pantryQuantity = this.numberService.toFormattedFraction(userIngredient.pantryQuantity);
                ingredient.cartQuantity = userIngredient.cartQuantity;
              }
            });
          });

          this.dataSource = new MatTableDataSource(ingredients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.userIngredients = userIngredients;
          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findIngredient(id: string): Ingredient {
    return this.dataSource.data.find(x => x.id === id);
  }

  editIngredient(id: string): void {
    let data = this.userIngredients.find(x => x.id === id);
    if (!data) {
      this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: 0});
      data = this.userIngredients.find(x => x.id === id);
    }

    this.ingredientModalParams = {
      data,
      userIngredients: this.userIngredients,
      dataSource: this.dataSource,
      text: `Edit pantry quantity for ${this.findIngredient(id).name}`,
      function: this.editIngredientEvent
    };
  }

  editIngredientEvent = (): void => {
    this.userIngredientService.update(this.userIngredients);
  };

  removeIngredient(id: string): void {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.findIngredient(id);
    if (data && Number(data.cartQuantity) > 0 && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.update(this.userIngredients);
    }
  }

  addIngredient(id: string): void {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.findIngredient(id);
    if (ingredient.amount) {
      if (data) {
        data.cartQuantity = Number(data.cartQuantity) + Number(ingredient.amount);
        ingredient.cartQuantity = Number(ingredient.cartQuantity) + Number(ingredient.amount);
      } else {
        this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: Number(ingredient.amount)});
        ingredient.cartQuantity = Number(ingredient.amount);
      }
      this.userIngredientService.update(this.userIngredients);
    }
  }

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
