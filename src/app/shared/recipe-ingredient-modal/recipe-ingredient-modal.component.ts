import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RecipeIngredientService } from '@recipeIngredientService';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { RecipeIngredientModal } from '@recipeIngredientModal';

@Component({
  selector: 'app-recipe-ingredient-modal',
  templateUrl: './recipe-ingredient-modal.component.html',
  styleUrls: ['./recipe-ingredient-modal.component.scss']
})
export class RecipeIngredientModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  params: RecipeIngredientModal;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  selectionCount = 0;

  constructor(
    private recipeIngredientServce: RecipeIngredientService
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.recipeIngredientServce.getModal().pipe(takeUntil(this.unsubscribe$)).subscribe(modal => {
      this.params = modal;
    });
  }

  select(isSelected) {
    this.selectionCount += isSelected ? 1 : -1;
  }

  add() {
    let selectedIngredients = [];
    this.params.ingredients.forEach(ingredient => {
      if (ingredient.selected) {
        selectedIngredients.push(ingredient);
      }
    });

    if (selectedIngredients.length === 0) {
      selectedIngredients = this.params.ingredients;
    }

    this.params.function(
      this.params.self,
      selectedIngredients,
      this.params.userIngredient,
      this.params.defaultShoppingList
    );

    this.selectionCount = 0;
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}
