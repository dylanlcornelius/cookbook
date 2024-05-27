import { Injectable } from '@angular/core';
import { NumberService } from '../../util/number.service';

export interface Multipliers {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeMultiplierService {
  multipliers: Multipliers = {} as Multipliers;

  constructor(private numberService: NumberService) {}

  getQuantity = (recipeId: string, defaultServings: string, quantity: string): string => {
    const servings = Number(defaultServings) || 1;
    const convertedQuantity = this.numberService.toDecimal(quantity);
    return this.numberService.toFraction(
      (convertedQuantity || 1) * ((this.multipliers[recipeId] || servings) / servings)
    );
  };

  decrement(recipeId: string, defaultServings: string): void {
    if (!this.multipliers[recipeId]) {
      this.multipliers[recipeId] = Number(defaultServings) || 1;
    }
    if (this.multipliers[recipeId] > 1) {
      this.multipliers[recipeId]--;
    }
  }

  increment(recipeId: string, defaultServings: string): void {
    if (!this.multipliers[recipeId]) {
      this.multipliers[recipeId] = Number(defaultServings) || 1;
    }
    this.multipliers[recipeId]++;
  }
}
