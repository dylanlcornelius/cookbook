import { Component, Input, OnInit } from '@angular/core';
import { Multipliers, RecipeMultiplierService } from './recipe-multiplier.service';

@Component({
  selector: 'app-recipe-multiplier',
  templateUrl: './recipe-multiplier.component.html',
  styleUrls: ['./recipe-multiplier.component.scss'],
})
export class RecipeMultiplierComponent implements OnInit {
  multipliers: Multipliers;

  @Input()
  recipeId: string;

  @Input()
  defaultServings: string;

  constructor(private recipeMultiplierService: RecipeMultiplierService) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.multipliers = this.recipeMultiplierService.multipliers;
  }

  decrement = this.recipeMultiplierService.decrement;
  increment = this.recipeMultiplierService.increment;
}
