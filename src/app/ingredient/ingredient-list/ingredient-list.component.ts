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
import { NumberService } from 'src/app/util/number.service';

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

  id: string;
  userIngredients = [];

  user: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private currentUserService: CurrentUserService,
    private ingredientService: IngredientService,
    private userIngredientService: UserIngredientService,
    private numberService: NumberService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      const userIngredients$ = this.userIngredientService.get(this.user.defaultShoppingList);
      const ingredients$ = this.ingredientService.get();
      combineLatest([userIngredients$, ingredients$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredient, ingredients]) => {
        this.id = userIngredient.id;
      
        const myIngredients = [];
        ingredients.forEach(ingredient => {
          ingredient.amount = this.numberService.toFormattedFraction(ingredient.amount);

          userIngredient.ingredients.forEach(myIngredient => {
            if (myIngredient.id === ingredient.id) {
              ingredient.pantryQuantity = this.numberService.toFormattedFraction(myIngredient.pantryQuantity);
              ingredient.cartQuantity = myIngredient.cartQuantity;

              myIngredients.push({
                id: myIngredient.id,
                pantryQuantity: myIngredient.pantryQuantity,
                cartQuantity: myIngredient.cartQuantity
              });
            }
          });
        });

        this.dataSource = new MatTableDataSource(ingredients);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.userIngredients = myIngredients;
        this.loading = false;
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  findIngredient(id) {
    return this.dataSource.data.find(x => x.id === id);
  }

  editIngredient(id) {
    let data = this.userIngredients.find(x => x.id === id);
    if (!data) {
      this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: 0});
      data = this.userIngredients.find(x => x.id === id);
    }

    this.ingredientModalParams = {
      data: data,
      self: this,
      text: 'Edit pantry quantity for ' + this.findIngredient(id).name,
      function: this.editIngredientEvent
    };
  }

  editIngredientEvent(self) {
    self.userIngredientService.formattedUpdate(self.userIngredients, self.user.defaultShoppingList, self.id);
  }

  removeIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.findIngredient(id);
    if (data && Number(data.cartQuantity) > 0 && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.formattedUpdate(this.userIngredients, this.user.defaultShoppingList, this.id);
    }
  }

  addIngredient(id) {
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
      this.userIngredientService.formattedUpdate(this.userIngredients, this.user.defaultShoppingList, this.id);
    }
  }
}
