import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipeFilterService {

  private filters = [];

  get selectedFilters(): Array<Filter> { return this.filters; }
  set selectedFilters(filters: Array<Filter>) { this.filters = filters; }

  constructor() { }

  recipeFilterPredicate(data, filters: Array<Filter>): boolean {
    return filters.reduce((hasAll, filter) => hasAll && filter.filterPredicate(data), true);
  }
}

abstract class Filter {
  value: any;

  constructor(value) {
    this.value = value;
  }

  // equals(a: string, b: string): boolean {
  //   return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
  // }

  contains(a: string, b: string): boolean {
    return a && a.toLowerCase().includes(b.toLowerCase());
  }

  abstract filterPredicate: (recipe: Recipe) => boolean;
}

export class AuthorFilter extends Filter {
  filterPredicate = (recipe) => this.contains(recipe.author, this.value); // may need to flip this to equals
}

export class CategoryFilter extends Filter {
  filterPredicate = (recipe) => !!recipe.categories.find(({ category }) => this.contains(category, this.value)); // may need to flip this to equals
}

export class RatingFilter extends Filter {
  filterPredicate = (recipe) => recipe.meanRating >= this.value;
}

export class SearchFilter extends Filter {
  filterPredicate = (recipe) => {
    return this.contains(recipe.name, this.value)
      || this.contains(recipe.description, this.value)
      || new CategoryFilter(this.value).filterPredicate(recipe)
      || !!recipe.steps.find(({ step }) => this.contains(step, this.value))
      || !!recipe.ingredients.find(({ name }) => this.contains(name, this.value))
      || new AuthorFilter(this.value).filterPredicate(recipe);
  };
}
