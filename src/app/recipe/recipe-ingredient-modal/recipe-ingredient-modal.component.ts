import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-recipe-ingredient-modal',
  templateUrl: './recipe-ingredient-modal.component.html',
  styleUrls: ['./recipe-ingredient-modal.component.scss']
})
export class RecipeIngredientModalComponent {
  @Input()
  params;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  selectionCount = 0;

  constructor() { }

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

    this.params.function(this.params.self, selectedIngredients);
    this.modal.close();
  }

  cancel() {
    this.modal.close();
  }
}
