import { Injectable } from '@angular/core';

export interface Multipliers {
  [key: string]: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeMultiplierService {
  multipliers: Multipliers = {} as Multipliers;

  constructor() {}

  getQuantity = (recipeId: string, defaultServings: string, quantity: string): number => {
    const servings = Number(defaultServings) || 1;

    return (Number(quantity) || 1) * ((this.multipliers[recipeId] || servings) / servings);
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
