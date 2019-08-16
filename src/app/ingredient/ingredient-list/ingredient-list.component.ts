import { Component, OnInit, ViewChild } from '@angular/core';
import { IngredientService } from '../shared/ingredient.service';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { CookieService } from 'ngx-cookie-service';
import { UserIngredientService } from 'src/app/shopping/shared/user-ingredient.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material';

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

  editIngredient(id) {
    let data = this.userIngredients.find(x => x.id === id);
    const ingredient = this.dataSource.data.find(x => x.id === id);
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
