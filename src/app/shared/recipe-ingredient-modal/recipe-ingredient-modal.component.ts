import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Ingredients } from '@ingredient';
import { ModalComponent, ModalComponentParams } from '@modalComponent';
import { RecipeIngredientModalService } from '@modalService';
import { Recipe, Recipes } from '@recipe';
import { RecipeIngredient, RecipeIngredients } from '@recipeIngredient';
import { RecipeIngredientService } from '@recipeIngredientService';
import { UOM } from '@uoms';
import { UserIngredients } from '@userIngredient';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MealPlannerComponent } from 'src/app/shopping/meal-planner/meal-planner.component';
import { RecipeMultiplierService } from '../recipe-multiplier/recipe-multiplier.service';

export interface RecipeIngredientModalParams extends ModalComponentParams {
  function: RecipeIngredientService['addIngredientsEvent'];
  recipe: Recipe;
  recipes: Recipes;
  recipeIngredients: RecipeIngredients;
  ingredients: Ingredients;
  userIngredients: UserIngredients;
  uid: string;
  householdId: string;
  callback?: MealPlannerComponent['addAllIngredients'];
}

@Component({
  selector: 'app-recipe-ingredient-modal',
  templateUrl: './recipe-ingredient-modal.component.html',
  styleUrls: ['./recipe-ingredient-modal.component.scss'],
})
export class RecipeIngredientModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  params?: RecipeIngredientModalParams;

  @ViewChild(ModalComponent)
  modal: ModalComponent<RecipeIngredientModalParams>;

  selectionCount = 0;
  ingredientCount = 0;

  constructor(
    private recipeIngredientModalService: RecipeIngredientModalService,
    private recipeMultiplierService: RecipeMultiplierService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.recipeIngredientModalService
      .getModal()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((modal: RecipeIngredientModalParams) => {
        this.params = modal;

        if (this.params) {
          this.params = {
            ...this.params,
            recipeIngredients: this.params.recipeIngredients
              .map((recipeIngredient) => {
                recipeIngredient.selected = true;
                if (recipeIngredient.uom === UOM.RECIPE) {
                  recipeIngredient.parent = null;
                }
                return recipeIngredient;
              })
              .filter(
                ({ id, uom }) =>
                  uom !== UOM.RECIPE ||
                  this.params?.recipeIngredients.filter(({ parent }) => parent === id).length
              ),
          };

          this.selectionCount = this.params.recipeIngredients.filter(
            ({ uom }) => uom !== UOM.RECIPE
          ).length;
          this.ingredientCount = this.selectionCount;
        }
      });
  }

  getQuantity = this.recipeMultiplierService.getQuantity;

  select(recipeIngredient: RecipeIngredient, isSelected: boolean): void {
    recipeIngredient.selected = isSelected;

    this.selectionCount =
      this.params?.recipeIngredients
        .filter(({ uom }) => uom !== UOM.RECIPE)
        .reduce((count, recipeIngredient) => (count += recipeIngredient.selected ? 1 : 0), 0) || 0;
  }

  add(): void {
    if (this.params) {
      let selectedIngredients: RecipeIngredients = [];
      this.params.recipeIngredients.forEach((ingredient) => {
        if (ingredient.selected) {
          selectedIngredients.push(ingredient);
        }
      });

      if (selectedIngredients.length === 0) {
        selectedIngredients = this.params.recipeIngredients;
      }

      this.params.function(
        selectedIngredients.map(
          (recipeIngredient) =>
            new RecipeIngredient({
              ...recipeIngredient,
              quantity: this.recipeMultiplierService.getQuantity(
                this.params!.recipe.id,
                this.params!.recipe.servings,
                recipeIngredient.quantity
              ),
            })
        ),
        this.params.userIngredients,
        this.params.ingredients,
        this.params.uid,
        this.params.householdId,
        this.params.recipe,
        this.params.recipes
      );
    }

    this.selectionCount = 0;
    this.modal.close(true);
  }

  cancel(): void {
    this.modal.close();
  }
}
