import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { IngredientService } from '@ingredientService';
import { RecipeService } from '@recipeService';
import { UserService } from '@userService';
import { ConfigService } from '../shared/config.service';
import { Config } from '../shared/config.model';
import { User } from 'src/app/user/shared/user.model';
import { Notification } from '@notifications';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  loading: Boolean = true;
  validationModalParams;
  notificationModalParams;

  configsDisplayedColumns = ['id', 'name', 'value', 'delete'];
  configsDataSource: Array<Config>;

  usersDisplayedColumns = ['id', 'firstName', 'lastName', 'roles', 'themes', 'delete'];
  roleList = ['user', 'admin', 'pending'];
  themeList = [true, false];
  usersDataSource: Array<User>;
  selectedRow: {};

  // ingredientsDisplayedColumns = ['name', 'type'];
  // ingredientsDataSource = [];
  // recipesDisplayedColumns = ['name', 'type'];
  // recipesDataSource = [];

  constructor(private formBuilder: FormBuilder,
    private configService: ConfigService,
    private userService: UserService,
    private ingredientService: IngredientService,
    private recipeService: RecipeService) {}

  ngOnInit() {
    this.configService.getConfigs().then(result => {
      this.configsDataSource = result;
    });
    this.userService.getUsers().then((result) => {
      this.usersDataSource = result;
      this.loading = false;
    });
    // this.recipeService.getRecipes().subscribe((result) => {
    //   this.recipesDataSource = this.getCollectionData(result);
    // });
    // this.ingredientService.getIngredients().subscribe((result) => {
    //   this.ingredientsDataSource = this.getCollectionData(result);
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
    this.configService.postConfig(new Config({}));
  }

  removeConfig(id, name) {
    if (!name) {
      name = 'NO NAME';
    }
    this.validationModalParams = {
      function: this.removeConfigEvent,
      id: id,
      self: this,
      text: 'Are you sure you want to delete config ' + name + '?'
    };
  }

  removeConfigEvent(self, id) {
    self.configService.deleteConfig(id)
      .subscribe(() => {},
      (err) => {
        console.error(err);
      });
  }

  removeUser(id, firstName, lastName) {
    if (!firstName && !lastName) {
      firstName = 'NO';
      lastName = 'NAME';
    }
    this.validationModalParams = {
      function: this.removeUserEvent,
      id: id,
      self: this,
      text: 'Are you sure you want to delete user ' + firstName + ' ' + lastName + '?'
    };
  }

  removeUserEvent(self, id) {
    self.userService.deleteUser(id)
    .subscribe(() => {},
    (err) => {
      console.log(err);
    });
  }

  revert() {
    this.validationModalParams = {
      function: this.revertEvent,
      self: this,
      text: 'Are you sure you want to revert your changes?'
    };
  }

  revertEvent(self) {
    self.configService.getConfigs().then((result) => {
      self.configsDataSource = result;
    });
    self.userService.getUsers().subscribe((result) => {
      self.usersDataSource = result;
    });
    self.notificationModalParams = {
      self: self,
      type: Notification.SUCCESS,
      text: 'Changes reverted!'
    };
  }

  save() {
    this.validationModalParams = {function: this.saveEvent, self: this, text: 'Are you sure you want to save your changes?'};
  }

  saveEvent(self) {
    self.configService.putConfigs(self.configsDataSource);
    // TODO: use model
    self.userService.putUsers(self.usersDataSource);
    self.notificationModalParams = {
      self: this,
      type: Notification.SUCCESS,
      text: 'Changes saved!'
    };
  }
}
