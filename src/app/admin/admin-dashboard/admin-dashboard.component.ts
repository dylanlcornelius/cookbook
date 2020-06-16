import { Component, OnInit } from '@angular/core';
import { IngredientService } from '@ingredientService';
import { RecipeService } from '@recipeService';
import { UserService } from '@userService';
import { ConfigService } from '../shared/config.service';
import { Config } from '../shared/config.model';
import { User } from 'src/app/user/shared/user.model';
import { Notification } from '@notifications';
import { combineLatest } from 'rxjs';
import { Ingredient } from 'src/app/ingredient/shared/ingredient.model';
import { Recipe } from 'src/app/recipe/shared/recipe.model';
import { UserIngredient } from 'src/app/shopping/shared/user-ingredient.model';
import { UserItem } from 'src/app/shopping/shared/user-item.model';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  loading: Boolean = true;
  validationModalParams;
  notificationModalParams;

  originalConfigs: Array<Config>;
  configContext = {
    title: 'Configurations',
    displayedColumns: ['id', 'name', 'value'],
    dataSource: [],
    add: this.addConfig,
    remove: this.removeConfig,
  };

  originalUsers: Array<User>;
  userContext = {
    title: 'Users',
    displayedColumns: ['id', 'firstName', 'lastName', 'role', 'theme'],
    dataSource: [],
    remove: this.removeUser,
  };

  originalRecipes: Array<Recipe>;
  recipeContext = {
    title: 'Recipes',
    displayedColumns: ['id', 'name', 'link', 'categories', 'steps', 'meanRating', 'uid', 'author'],
    dataSource: []
  };

  originalIngredients: Array<Ingredient>;
  ingredientContext = {
    title: 'Ingredients',
    displayedColumns: ['id', 'name', 'category', 'amount', 'uom'],
    dataSource: []
  };

  originalUserIngredients: Array<UserIngredient>;
  userIngredientContext = {
    title: 'User Ingredients',
    displayedColumns: ['id', 'uid', 'ingredients'],
    dataSource: []
  };

  originalUserItems: Array<UserItem>;
  userItemContext = {
    title: 'User Items',
    displayedColumns: ['id', 'uid', 'items'],
    dataSource: []
  };

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private userItemService: UserItemService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    const configs$ = this.configService.getConfigs();
    const users$ = this.userService.getUsers();
    const recipes$ = this.recipeService.getRecipes();
    const ingredients$ = this.ingredientService.getIngredients();
    const userIngredients$ = this.userIngredientService.getUserIngredients();
    const userItems$ = this.userItemService.getUserItems();

    combineLatest(configs$, users$, recipes$, ingredients$, userIngredients$, userItems$)
    .subscribe(([configs, users, recipes, ingredients, userIngredients, userItems]) => {
      this.originalConfigs = configs;
      this.configContext.dataSource = configs;

      this.originalUsers = users;
      this.userContext.dataSource = users;

      this.originalRecipes = recipes;
      this.recipeContext.dataSource = recipes;

      this.originalIngredients = ingredients;
      this.ingredientContext.dataSource = ingredients;

      this.originalUserIngredients = userIngredients;
      this.userIngredientContext.dataSource = userIngredients;

      this.originalUserItems = userItems;
      this.userItemContext.dataSource = userItems;
      
      this.loading = false;
    });
  }

  isArray(obj) {
    return Array.isArray(obj);
  }

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
    self.configService.deleteConfig(id);
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
    self.userService.deleteUser(id);
  }

  revert() {
    this.validationModalParams = {
      function: this.revertEvent,
      self: this,
      text: 'Are you sure you want to revert your changes?'
    };
  }

  revertEvent(self) {
    self.configContext.dataSource = self.originalConfigs;
    self.userContext.dataSource = self.originalUsers;
    self.recipeContext.dataSource = self.originalRecipes;
    self.ingredientContext.dataSource = self.originalIngredients;
    self.userIngredientContext.dataSource = self.originalUserIngredients;
    self.userItemContext.dataSource = self.originalUserItems;

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
    self.configService.putConfigs(self.configContext.dataSource);
    self.userService.putUsers(self.userContext.dataSource);
    self.recipeService.putRecipes(self.recipeContext.dataSource);
    self.ingredientService.putIngredients(self.ingredientContext.dataSource);
    self.userIngredientService.putUserIngredients(self.userIngredientContext.dataSource);
    self.userItemService.putUserItems(self.userItemContext.dataSource);

    self.notificationModalParams = {
      self: this,
      type: Notification.SUCCESS,
      text: 'Changes saved!'
    };
  }
}
