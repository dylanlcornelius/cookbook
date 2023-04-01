import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Recipe } from "@recipe";
import { RecipeHistoryService } from '@recipeHistoryService';
import { first } from 'rxjs/operators';

@Component({
  selector: "app-recipe-cook-button",
  templateUrl: "./recipe-cook-button.component.html",
  styleUrls: ["./recipe-cook-button.component.scss"],
})
export class RecipeCookButtonComponent {
  recipeRatingModalParams;

  @Input() recipe: Recipe = new Recipe({});
  @Input() uid: string;
  @Input() householdId: string;
  @Output() removeIngredients: EventEmitter<void> = new EventEmitter();

  constructor(
    private recipeHistoryService: RecipeHistoryService,
  ) { }

  remove(): void {
    this.recipeHistoryService.get(this.householdId, this.recipe.id).pipe(first()).subscribe(recipeHistory => {
      const userRating = this.recipe.ratings.find(rating => rating.uid === this.uid)?.rating;

      if (recipeHistory.timesCooked && userRating > 2) {
        this.removeEvent();
        return;
      }

      this.recipeRatingModalParams = {
        function: this.removeEvent,
        recipe: this.recipe,
        uid: this.uid,
        timesCooked: recipeHistory.timesCooked,
        text: `Rate ${this.recipe.name}?`
      };
    });
  }

  removeEvent = (): void => {
    this.removeIngredients.emit();
  };
}
