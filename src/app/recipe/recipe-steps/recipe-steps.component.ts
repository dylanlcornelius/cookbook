import { Component, Input } from '@angular/core';
import { Recipe } from '@recipe';

@Component({
  selector: 'app-recipe-steps',
  templateUrl: './recipe-steps.component.html',
  styleUrls: ['./recipe-steps.component.scss'],
})
export class RecipeStepsComponent {
  @Input()
  steps?: Recipe['steps'];

  toggleStep(step: Recipe['steps'][0]): void {
    step.isSelected = !step.isSelected;
  }

  toggleDirections(step: Recipe['steps'][0]): void {
    step.isExpanded = !step.isExpanded;
  }
}
