import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../../ingredient/ingredient.service';
import { RecipeService } from '../../recipe/recipe.service';
import { UserService } from '../../user/user.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ConfigService } from '../config.service';
import { Config } from '../config.model';
import { User } from 'src/app/user/user.model';
import { Notification } from 'src/app/modals/notification-modal/notification.enum';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  loading: Boolean = true;
  validationModalParams;
  notificationModalParams;

  configsDisplayedColumns = ['id', 'name', 'value', 'delete'];
  configsDataSource: Array<Config>;

  usersDisplayedColumns = ['id', 'firstName', 'lastName', 'roles', 'delete'];
  roleList = ['user', 'admin', 'pending'];
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
    this.configService.getConfigs().subscribe((result) => {
      this.configsDataSource = result;
    });
    this.userService.getUsers().subscribe((result) => {
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
    this.configService.postConfig(new Config('', '', ''))
      .subscribe(() => {},
      (err) => {
        console.error(err);
      });
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

  removeConfigEvent = function(self, id) {
    self.configService.deleteConfig(id)
      .subscribe(() => {},
      (err) => {
        console.error(err);
      });
  };

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

  removeUserEvent = function(self, id) {
    self.userService.deleteUser(id)
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
  };

  save() {
    this.validationModalParams = {function: this.saveEvent, self: this, text: 'Are you sure you want to save your changes?'};
  }

  saveEvent = function(self) {
    self.configService.putConfigs(self.configsDataSource);
    self.userService.putUsers(self.usersDataSource);
    self.notificationModalParams = {
      self: this,
      type: Notification.SUCCESS,
      text: 'Changes saved!'
    };
  };
}
