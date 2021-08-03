import { Component, OnInit, OnDestroy } from '@angular/core';
import { IngredientService } from '@ingredientService';
import { RecipeService } from '@recipeService';
import { UserService } from '@userService';
import { ConfigService } from '@configService';
import { Config } from '@config';
import { User } from '@user';
import { combineLatest, Subject } from 'rxjs';
import { Ingredient } from '@ingredient';
import { Recipe } from '@recipe';
import { UserIngredient } from '@userIngredient';
import { UserItem } from '@userItem';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { takeUntil } from 'rxjs/operators';
import { SuccessNotification } from '@notification';
import { NotificationService } from '@notificationService';
import { Navigation } from '@navigation';
import { NavigationService } from '@navigationService';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading: Boolean = true;
  validationModalParams;

  originalConfigs: Config[];
  configContext = {
    title: 'Configurations',
    displayedColumns: ['id', 'name', 'value', 'creationDate'],
    dataSource: [],
    add: this.addConfig,
    remove: this.removeConfig,
    self: this,
  };

  originalNavs: Navigation[];
  navigationContext = {
    title: 'Navs',
    displayedColumns: ['id', 'name', 'link', 'icon', 'order', 'subMenu', 'isNavOnly', 'creationDate'],
    dataSource: [],
    add: this.addNav,
    remove: this.removeNav,
    self: this,
  }

  originalUsers: User[];
  userContext = {
    title: 'Users',
    displayedColumns: ['id', 'firstName', 'lastName', 'role', 'theme', 'creationDate'],
    dataSource: [],
    remove: this.removeUser,
    self: this,
  };

  originalRecipes: Recipe[];
  recipeContext = {
    title: 'Recipes',
    displayedColumns: ['id', 'name', 'link', 'categories', 'steps', 'meanRating', 'uid', 'author', 'creationDate'],
    dataSource: []
  };

  originalIngredients: Ingredient[];
  ingredientContext = {
    title: 'Ingredients',
    displayedColumns: ['id', 'name', 'category', 'amount', 'uom', 'creationDate'],
    dataSource: []
  };

  originalUserIngredients: UserIngredient[];
  userIngredientContext = {
    title: 'User Ingredients',
    displayedColumns: ['id', 'uid', 'ingredients', 'creationDate'],
    dataSource: []
  };

  originalUserItems: UserItem[];
  userItemContext = {
    title: 'User Items',
    displayedColumns: ['id', 'uid', 'items', 'creationDate'],
    dataSource: []
  };

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private ingredientService: IngredientService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private userItemService: UserItemService,
    private navigationService: NavigationService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    const configs$ = this.configService.get();
    const navs$ = this.navigationService.get();
    const users$ = this.userService.get();
    const recipes$ = this.recipeService.get();
    const ingredients$ = this.ingredientService.get();
    const userIngredients$ = this.userIngredientService.get();
    const userItems$ = this.userItemService.get();

    combineLatest([configs$, navs$, users$, recipes$, ingredients$, userIngredients$, userItems$])
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(([configs, navs, users, recipes, ingredients, userIngredients, userItems]: [Config[], Navigation[], User[], Recipe[], Ingredient[], UserIngredient[], UserItem[]]) => {
      this.originalConfigs = configs;
      this.configContext.dataSource = configs;

      this.originalNavs = navs;
      this.navigationContext.dataSource = navs;

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

  addConfig(self) {
    self.configService.create({});
  }

  removeConfig(self, id, name) {
    if (!name) {
      name = 'NO NAME';
    }

    self.validationModalParams = {
      function: self.removeConfigEvent,
      id: id,
      self: self,
      text: `Are you sure you want to delete config ${name}?`
    };
  }

  removeConfigEvent(self, id) {
    self.configService.delete(id);
  }

  addNav(self) {
    self.navigationService.create({});
  }

  removeNav(self, id, name) {
    if (!name) {
      name = 'NO NAME';
    }

    self.validationModalParams = {
      function: self.removeNavEvent,
      id: id,
      self: self,
      text: `Are you sure you want to delete nav ${name}?`
    }
  }

  removeNavEvent(self, id) {
    self.navigationService.delete(id);
  }

  removeUser(self, id, firstName, lastName) {
    if (!firstName && !lastName) {
      firstName = 'NO';
      lastName = 'NAME';
    }
    
    self.validationModalParams = {
      function: self.removeUserEvent,
      id: id,
      self: self,
      text: `Are you sure you want to delete user ${firstName} ${lastName}?`
    };
  }

  removeUserEvent(self, id) {
    self.userService.delete(id);
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
    self.navigationContext.dataSource = self.originalNavs;
    self.userContext.dataSource = self.originalUsers;
    self.recipeContext.dataSource = self.originalRecipes;
    self.ingredientContext.dataSource = self.originalIngredients;
    self.userIngredientContext.dataSource = self.originalUserIngredients;
    self.userItemContext.dataSource = self.originalUserItems;

    self.notificationService.setNotification(new SuccessNotification('Changes reverted'));
  }

  save() {
    this.validationModalParams = {function: this.saveEvent, self: this, text: 'Are you sure you want to save your changes?'};
  }

  saveEvent(self) {
    self.configService.update(self.configContext.dataSource);
    self.navigationService.update(self.navigationContext.dataSource);
    self.userService.update(self.userContext.dataSource);
    self.recipeService.update(self.recipeContext.dataSource);
    self.ingredientService.update(self.ingredientContext.dataSource);
    self.userIngredientService.update(self.userIngredientContext.dataSource);
    self.userItemService.update(self.userItemContext.dataSource);

    self.notificationService.setNotification(new SuccessNotification('Changes saved!'));
  }
}
