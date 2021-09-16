import { Injectable } from '@angular/core';
import { Recipe } from '@recipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeFilterService {

  private filters = [];

  get selectedFilters(): Array<Filter> { return this.filters; }
  set selectedFilters(filters: Array<Filter>) { this.filters = filters; }

  constructor() { }

  recipeFilterPredicate(data: Recipe, filters: Array<Filter>): boolean {
    if (!filters.length) {
      return true;
    }

    let valid = true;
    for (const filterType of Object.values(FILTER_TYPE)) {
      const filtersByType = filters.filter(({ type }) => type === filterType);

      if (filtersByType.length) {
        if (filterType === FILTER_TYPE.RATING) {
          valid = valid && filtersByType.reduce((hasSome, filter) => hasSome || filter.filterPredicate(data), false);
        } else {
          valid = valid && filtersByType.reduce((hasAll, filter) => hasAll && filter.filterPredicate(data), true);
        }
      }
    }
    return valid;
  }
}

export enum FILTER_TYPE {
  AUTHOR = 'AUTHOR',
  CATEGORY = 'CATEGORY',
  RATING = 'RATING',
  SEARCH = 'SEARCH',
}

export abstract class Filter {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  // equals(a: string, b: string): boolean {
  //   return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
  // }

  contains(a: string, b: string): boolean {
    return a && a.toLowerCase().includes(b.toLowerCase());
  }

  abstract type: string;
  abstract filterPredicate: (recipe: Recipe) => boolean;
}

export class AuthorFilter extends Filter {
  type = FILTER_TYPE.AUTHOR;
  filterPredicate = (recipe: Recipe): boolean => this.contains(recipe.author, this.value); // may need to flip this to equals
}

export class CategoryFilter extends Filter {
  type = FILTER_TYPE.CATEGORY;
  filterPredicate = (recipe: Recipe): boolean => !!recipe.categories.find(({ category }) => this.contains(category, this.value)); // may need to flip this to equals
}

export class RatingFilter extends Filter {
  type = FILTER_TYPE.RATING;
  filterPredicate = (recipe: Recipe): boolean => this.value - recipe.meanRating >= 0 && this.value - recipe.meanRating < (1 / 3 * 100);
}

export class SearchFilter extends Filter {
  type = FILTER_TYPE.SEARCH;
  filterPredicate = (recipe: Recipe): boolean => {
    return this.contains(recipe.name, this.value)
      || this.contains(recipe.description, this.value)
      || new CategoryFilter(this.value).filterPredicate(recipe)
      || !!recipe.steps.find(({ step }) => this.contains(step, this.value))
      || !!recipe.ingredients.find(({ name }) => this.contains(name, this.value))
      || new AuthorFilter(this.value).filterPredicate(recipe);
  };
}
