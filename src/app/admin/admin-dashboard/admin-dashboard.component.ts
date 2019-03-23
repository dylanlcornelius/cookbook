import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../ingredients/ingredient.service';
import { RecipeService } from '../../recipes/recipe.service';
import { UserService } from '../../user/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  // types: null, string, array droplist?
  // probably just only null for new records

  loading: Boolean = true;
  validationModalParams: {};

  configsDisplayedColumns = ['key', 'name', 'value', 'delete'];
  configsDatasource = [];

  usersDisplayedColumns = ['key', 'firstName', 'lastName', 'roles', 'delete'];
  roleList = ['user', 'admin', 'pending'];
  usersDatasource = [];
  // usersForm: FormGroup;
  selectedRow: {};

  // ingredientsDisplayedColumns = ['name', 'type'];
  // ingredientsDatasource = [];
  // recipesDisplayedColumns = ['name', 'type'];
  // recipesDatasource = [];

  constructor(private formBuilder: FormBuilder,
    private configService: ConfigService,
    private userService: UserService,
    private ingredientService: IngredientService,
    private recipeService: RecipeService) {}

  ngOnInit() {
    this.configService.getConfigs().subscribe((result) => {
      this.configsDatasource = result;
      this.loading = false;
    });
    this.userService.getUsers().subscribe((result) => {
      this.usersDatasource = result;
    });
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

  // TODO: dynamically add, remove, init, revert, save datasources

  addConfig() {
    this.configService.postConfig({key: '', name: '', value: ''})
      .subscribe(() => {},
      (err) => {
        console.error(err);
      });
  }

  removeConfig(key, name) {
    if (!name) {
      name = 'NO NAME';
    }
    this.validationModalParams = {
      function: this.removeConfigEvent,
      id: key,
      self: this,
      text: 'Are you sure you want to delete config ' + name + '?'
    };
  }

  removeConfigEvent = function(self, key) {
    self.configService.deleteConfig(key)
      .subscribe(() => {},
      (err) => {
        console.error(err);
      });
  };

  removeUser(key, firstName, lastName) {
    if (!firstName && !lastName) {
      firstName = 'NO';
      lastName = 'NAME';
    }
    this.validationModalParams = {
      function: this.removeUserEvent,
      id: key,
      self: this,
      text: 'Are you sure you want to delete user ' + firstName + ' ' + lastName + '?'
    };
  }

  removeUserEvent = function(self, key) {
    self.userService.deleteUser(key)
    .subscribe(() => {},
    (err) => {
      console.log(err);
    });
  };

  revert() {
    this.validationModalParams = {
      function: this.revertEvent,
      self: this,
      text: 'Are you sure you want to revert your changes?'
    };
  }

  revertEvent = function(self) {
    self.configService.getConfigs().subscribe((result) => {
      self.configsDatasource = result;
    });
    self.userService.getUsers().subscribe((result) => {
      self.usersDatasource = result;
    });
  };

  save() {
    this.validationModalParams = {function: this.saveEvent, self: this, text: 'Are you sure you want to save your changes?'};
  }

  saveEvent = function(self) {
    self.configService.putConfigs(self.configsDatasource);
    self.userService.putUsers(self.usersDatasource);
  };
}
