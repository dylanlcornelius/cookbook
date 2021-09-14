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
import { NotificationService, ValidationService } from '@modalService';
import { Navigation } from '@navigation';
import { NavigationService } from '@navigationService';
import { Validation } from '@validation';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;

  originalConfigs: Config[];
  configContext = {
    title: 'Configurations',
    displayedColumns: ['id', 'name', 'value', 'creationDate'],
    dataSource: [],
    add: this.addConfig,
    remove: this.removeConfig,
  };

  originalNavs: Navigation[];
  navigationContext = {
    title: 'Navs',
    displayedColumns: ['id', 'name', 'link', 'icon', 'order', 'subMenu', 'isNavOnly', 'creationDate'],
    dataSource: [],
    add: this.addNav,
    remove: this.removeNav,
  };

  originalUsers: User[];
  userContext = {
    title: 'Users',
    displayedColumns: ['id', 'firstName', 'lastName', 'role', 'theme', 'creationDate'],
    dataSource: [],
    remove: this.removeUser,
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
    private validationService: ValidationService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
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

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  addConfig(): void {
    this.configService.create(new Config({}));
  }

  removeConfig(id: string, name: string): void {
    if (!name) {
      name = 'NO NAME';
    }

    this.validationService.setModal(new Validation(
      `Are you sure you want to delete config ${name}?`,
      this.removeConfigEvent,
      [id]
    ));
  }

  removeConfigEvent = (id: string): void => {
    this.configService.delete(id);
  };

  addNav(): void {
    this.navigationService.create(new Navigation({}));
  }

  removeNav(id: string, name: string): void {
    if (!name) {
      name = 'NO NAME';
    }

    this.validationService.setModal(new Validation(
      `Are you sure you want to delete nav ${name}?`,
      this.removeNavEvent,
      [id]
    ));
  }

  removeNavEvent= (id: string): void => {
    this.navigationService.delete(id);
  };

  removeUser(id: string, firstName: string, lastName: string): void {
    if (!firstName && !lastName) {
      firstName = 'NO';
      lastName = 'NAME';
    }
    
    this.validationService.setModal(new Validation(
      `Are you sure you want to delete user ${firstName} ${lastName}?`,
      this.removeUserEvent,
      [id]
    ));
  }

  removeUserEvent = (id: string): void => {
    this.userService.delete(id);
  };

  revert(): void {
    this.validationService.setModal(new Validation(
      'Are you sure you want to revert your changes?',
      this.revertEvent
    ));
  }

  revertEvent = (): void => {
    this.configContext.dataSource = this.originalConfigs;
    this.navigationContext.dataSource = this.originalNavs;
    this.userContext.dataSource = this.originalUsers;
    this.recipeContext.dataSource = this.originalRecipes;
    this.ingredientContext.dataSource = this.originalIngredients;
    this.userIngredientContext.dataSource = this.originalUserIngredients;
    this.userItemContext.dataSource = this.originalUserItems;

    this.notificationService.setModal(new SuccessNotification('Changes reverted'));
  };

  save(): void {
    this.validationService.setModal(new Validation(
      'Are you sure you want to save your changes?',
      this.saveEvent
    ));
  }

  saveEvent = (): void => {
    this.configService.update(this.configContext.dataSource);
    this.navigationService.update(this.navigationContext.dataSource);
    this.userService.update(this.userContext.dataSource);
    this.recipeService.update(this.recipeContext.dataSource);
    this.ingredientService.update(this.ingredientContext.dataSource);
    this.userIngredientService.update(this.userIngredientContext.dataSource);
    this.userItemService.update(this.userItemContext.dataSource);

    this.notificationService.setModal(new SuccessNotification('Changes saved!'));
  };
}
