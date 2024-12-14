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
import { ModalComponent, ModalComponentParams } from '@modalComponent';

export interface RecipeRatingModalParams extends ModalComponentParams {
  function: () => void;
  recipe: Recipe;
  uid: string;
  timesCooked: number;
  text: string;
}

@Component({
  selector: 'app-recipe-rating-modal',
  templateUrl: './recipe-rating-modal.component.html',
  styleUrls: ['./recipe-rating-modal.component.scss'],
})
export class RecipeRatingModalComponent {
  params?: RecipeRatingModalParams;

  @Input()
  set Params(params: RecipeRatingModalParams | undefined) {
    this.params = params;
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent<RecipeRatingModalParams>;

  constructor(private recipeService: RecipeService) {}

  onRate(rating: number, recipe: Recipe): void {
    if (this.params) {
      this.recipeService.rateRecipe(rating, this.params.uid, recipe);
      this.params.function();
    }
    this.modal.close();
  }

  confirm(): void {
    this.params?.function();
    this.modal.close();
  }

  cancel(): void {
    this.modal.close();
  }
}
