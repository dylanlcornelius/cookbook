import { Component, OnInit, ViewChild } from '@angular/core';
import { IngredientService } from '@ingredientService';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { UserIngredientService } from '@userIngredientService';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '@userService';

@Component({
  selector: 'app-ingredient-list',
  templateUrl: './ingredient-list.component.html',
  styleUrls: ['./ingredient-list.component.scss']
})
export class IngredientListComponent implements OnInit {
  loading = true;
  ingredientModalParams;

  displayedColumns = ['name', 'category', 'amount', 'calories', 'pantryQuantity', 'cartQuantity'];
  dataSource;
  uid: string;
  id: string;
  userIngredients = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private userService: UserService,
    private ingredientService: IngredientService,
    private userIngredientService: UserIngredientService,
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(user => {
      this.uid = user.uid;

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

          this.dataSource = new MatTableDataSource(ingredients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.userIngredients = myIngredients;
          this.loading = false;
        });
      });
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editIngredient(id) {
    let data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.data.find(x => x.id === id);
    if (!data) {
      this.userIngredients.push({id: id, pantryQuantity: 0, cartQuantity: 0});
      data = this.userIngredients.find(x => x.id === id);
    }
    this.ingredientModalParams = {
      data: data,
      self: this,
      text: 'Edit pantry quantity for ' + ingredient.name,
      function: (self) => {
        self.userIngredientService.putUserIngredient(self.packageData(self));
      },
    };
  }

  packageData(self) {
    const data = [];
    self.userIngredients.forEach(d => {
      data.push({id: d.id, pantryQuantity: d.pantryQuantity, cartQuantity: d.cartQuantity});
    });
    return new UserIngredient({
      uid: self.uid, 
      ingredients: data, 
      id: self.id
    });
  }

  removeIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.data.find(x => x.id === id);
    if (data && Number(data.cartQuantity) > 0 && ingredient.amount) {
      data.cartQuantity = Number(data.cartQuantity) - Number(ingredient.amount);
      ingredient.cartQuantity = Number(ingredient.cartQuantity) - Number(ingredient.amount);
      this.userIngredientService.putUserIngredient(this.packageData(this));
    }
  }

  addIngredient(id) {
    const data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.data.find(x => x.id === id);
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
