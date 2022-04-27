import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { NotificationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User } from '@user';
import { RecipeIngredientService } from '@recipeIngredientService';
import { HouseholdService } from '@householdService';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { MealPlanService } from '../shared/meal-plan.service';
import { MealPlan } from '../shared/meal-plan.model';
import { RecipeService } from '@recipeService';
import { UserIngredient } from '@userIngredient';
import { Recipe } from '@recipe';
import { UserIngredientService } from '@userIngredientService';

@Component({
  selector: 'app-meal-planner',
  templateUrl: './meal-planner.component.html',
  styleUrls: ['./meal-planner.component.scss']
})
export class MealPlannerComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  isCompleted = false;

  user: User;
  householdId: string;
  userIngredient: UserIngredient;
  recipes: Recipe[];

  recipeControl = new FormControl();
  filteredRecipes: Observable<Recipe[]>;

  mealPlan: MealPlan;

  constructor(
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private mealPlanService: MealPlanService,
    private recipeService: RecipeService,
    private userIngredientService: UserIngredientService,
    private notificationService: NotificationService,
    private recipeIngredientService: RecipeIngredientService,
    private tutorialService: TutorialService,
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.loading = this.loadingService.set(true);

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      
      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        const userIngredient$ = this.userIngredientService.get(this.householdId);
        const recipes$ = this.recipeService.get();
        const mealPlan$ = this.mealPlanService.get(this.householdId);

        combineLatest([userIngredient$, recipes$, mealPlan$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([userIngredient, recipes, mealPlan]) => {
          this.userIngredient = userIngredient;
          this.recipes = recipes;

          mealPlan.recipes = mealPlan.recipes.map(planRecipe => recipes.find(({ id }) => id === planRecipe.id));
          this.mealPlan = mealPlan;

          this.filteredRecipes = this.recipeControl.valueChanges.pipe(
            startWith(''),
            map(value => this.recipes.filter(({ name }) => name.toLowerCase().includes(value?.toLowerCase ? value.toLowerCase() : '')))
          );

          this.loading = this.loadingService.set(false);
        });
      });
    });
  }

  addRecipe(recipe: Recipe): void {
    this.mealPlanService.formattedUpdate([...this.mealPlan.recipes, recipe], this.householdId, this.mealPlan.id);
    this.notificationService.setModal(new SuccessNotification('Recipe added!'));
    this.recipeControl.reset();
  }

  removeRecipe(index: number): void {
    this.mealPlan.recipes = this.mealPlan.recipes.filter((_x, i) =>  i !== index);

    this.mealPlanService.formattedUpdate(this.mealPlan.recipes, this.householdId, this.mealPlan.id);
    this.notificationService.setModal(new SuccessNotification('Recipe removed!'));
  }
  
  addIngredients(index: number): void {
    const recipe = this.mealPlan.recipes.find((_x, i) =>  i === index);
    const callback = (success: boolean) => {
      if (success) {
        this.mealPlan.recipes = this.mealPlan.recipes.filter((_x, i) =>  i !== index);
        this.mealPlanService.formattedUpdate(this.mealPlan.recipes, this.householdId, this.mealPlan.id);
      }
    }; 

    this.recipeIngredientService.addIngredients(recipe, this.recipes, this.userIngredient, this.householdId, callback);
  }

  addAllIngredients = (success?: boolean, isStart?: boolean): void => {
    if (!success && !isStart) {
      return;
    }

    if (success) {
      this.mealPlan.recipes = this.mealPlan.recipes.slice(1);
      this.mealPlanService.formattedUpdate(this.mealPlan.recipes, this.householdId, this.mealPlan.id);
    }
    const recipe = this.mealPlan.recipes[0];

    if (recipe) {
      this.recipeIngredientService.addIngredients(recipe, this.recipes, this.userIngredient, this.householdId, this.addAllIngredients);
    }
  };

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}

