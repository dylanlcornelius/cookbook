import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { IngredientService } from '../../ingredients/ingredient.service';
import { RecipeService } from '../../recipes/recipe.service';
import { UserService } from '../../user/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // types: null, string, array droplist?
  // probably just only null for new records

  loading: Boolean = true;

  // ingredientsDisplayedColumns = ['name', 'type'];
  // ingredientsDatasource = [];
  // recipesDisplayedColumns = ['name', 'type'];
  // recipesDatasource = [];
  // usersDisplayedColumns = ['name', 'type'];
  // usersDatasource = [];
  usersDisplayedColumns = ['key', 'firstName', 'lastName', 'role'];
  roleList = ['user', 'admin'];
  usersDatasource = [];
  form: FormGroup;
  selectedRow: {};

  constructor(private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private userService: UserService) {
      this.form = this.formBuilder.group({
        roles: new FormArray(this.usersDatasource.map(item => new FormGroup({
          role: new FormControl(item.role)
        })))
      });
    }

  ngOnInit() {
    this.userService.getUsers().subscribe((result) => {
      this.usersDatasource = result;
      this.loading = false;
    });
    // users
    // this.recipeService.getRecipes().subscribe((result) => {
    //   this.recipesDatasource = this.getCollectionData(result);
    // });
    // this.ingredientService.getIngredients().subscribe((result) => {
    //   this.ingredientsDatasource = this.getCollectionData(result);
    // });
  }

  getCollectionData(result) {
    const data = [];
    if (result.length > 0) {
      Object.entries(result[0]).forEach(([key, value]) => {
        let type = 'null';
        if (value instanceof String) {
          type = 'String';
        } else if (value instanceof Array) {
          type = 'Array';
        }
        data.push({name: key, type: type});
      });
    }
    return data;
  }

  // unlock row button / save row button?
  // or just save users

  // delete user

}
