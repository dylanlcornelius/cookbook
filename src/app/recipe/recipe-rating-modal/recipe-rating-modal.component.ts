/*
** DROP THIS IN HTML **
<app-recipe-rating-modal [Params]="recipeRatingModalParams"></app-recipe-rating-modal>

** DROP THIS IN TYPESCRIPT **
recipeRatingModalParams;

this.recipeRatingModalParams = {
  function: this.removeIngredients.emit;
  recipe: recipe,
  uid: this.user.uid,
  text: `Rate ${recipe.name}?`
};
*/

import { Component, Input, ViewChild } from '@angular/core';
import { Recipe } from '@recipe';
import { RecipeService } from '@recipeService';
import { ModalComponent } from '@modalComponent';

@Component({
  selector: 'app-recipe-rating-modal',
  templateUrl: './recipe-rating-modal.component.html',
  styleUrls: ['./recipe-rating-modal.component.scss'],
})
export class RecipeRatingModalComponent {
  params;

  @Input()
  set Params(params: {
    function: Function;
    recipe: Recipe;
    uid: string;
    timesCooked: number;
    text: string;
  }) {
    this.params = params;
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(private recipeService: RecipeService) {}

  onRate(rating: number, recipe: Recipe): void {
    this.recipeService.rateRecipe(rating, this.params.uid, recipe);
    this.params.function();
    this.modal.close();
  }

  confirm(): void {
    this.params.function();
    this.modal.close();
  }

  cancel(): void {
    this.modal.close();
  }
}
