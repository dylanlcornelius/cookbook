import { Injectable } from '@angular/core';
import { Recipe } from '@recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeFilterService {
  private filters: Filters = [];

  get selectedFilters(): Filters {
    return this.filters;
  }
  set selectedFilters(filters: Filters) {
    this.filters = filters;
  }

  pageIndex: number;
  recipeId: Recipe['id'];

  constructor() {}

  recipeFilterPredicate(data: Recipe, filters: Filters): boolean {
    if (!filters.length) {
      return true;
    }

    let valid = true;
    for (const filterType of Object.values(FILTER_TYPE)) {
      const filtersByType = filters.filter(({ type }) => type === filterType);

      if (filtersByType.length) {
        if (filterType === FILTER_TYPE.RATING) {
          valid =
            valid &&
            filtersByType.reduce(
              (hasSome, filter) => hasSome || filter.filterPredicate(data),
              false
            );
        } else {
          valid =
            valid &&
            filtersByType.reduce((hasAll, filter) => hasAll && filter.filterPredicate(data), true);
        }
      }
    }
    return valid;
  }
}

export enum FILTER_TYPE {
  AUTHOR = 'AUTHOR',
  TYPE = 'TYPE',
  RESTRICTION = 'RESTRICTION',
  TEMPERATURE = 'TEMPERATURE',
  CATEGORY = 'CATEGORY',
  RATING = 'RATING',
  STATUS = 'STATUS',
  IMAGE = 'IMAGE',
  SEARCH = 'SEARCH',
}

export abstract class Filter {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  equals(a: string, b: string): boolean {
    return a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;
  }

  contains(a: string, b: string): boolean {
    return a && a.toLowerCase().includes(b.toLowerCase());
  }

  abstract type: string;
  abstract filterPredicate: (recipe: Recipe) => boolean;
}

export type Filters = Filter[];

export class AuthorFilter extends Filter {
  type = FILTER_TYPE.AUTHOR;
  filterPredicate = (recipe: Recipe): boolean => this.equals(recipe.author, this.value);
}

export class TypeFilter extends Filter {
  type = FILTER_TYPE.TYPE;
  filterPredicate = (recipe: Recipe): boolean => this.equals(recipe.type, this.value);
}

export class RestrictionFilter extends Filter {
  type = FILTER_TYPE.RESTRICTION;
  filterPredicate = (recipe: Recipe): boolean => recipe[this.value] === true;
}

export class TemperatureFilter extends Filter {
  type = FILTER_TYPE.TEMPERATURE;
  filterPredicate = (recipe: Recipe): boolean => recipe[this.value] === true;
}

export class CategoryFilter extends Filter {
  type = FILTER_TYPE.CATEGORY;
  filterPredicate = (recipe: Recipe): boolean =>
    !!recipe.categories.find(({ category }) => this.equals(category, this.value)) ||
    (recipe.hasNewCategory && this.value === 'New!') ||
    (recipe.hasNeedsImageCategory && this.value === 'Needs Image');
}

export class RatingFilter extends Filter {
  type = FILTER_TYPE.RATING;
  filterPredicate = (recipe: Recipe): boolean =>
    this.value - recipe.meanRating >= 0 && this.value - recipe.meanRating < (1 / 3) * 100;
}

export class StatusFilter extends Filter {
  type = FILTER_TYPE.STATUS;
  filterPredicate = (recipe: Recipe): boolean => this.value === recipe.status;
}

export class ImageFilter extends Filter {
  type = FILTER_TYPE.IMAGE;
  filterPredicate = (recipe: Recipe): boolean => this.value === recipe.hasImage;
}

export class SearchFilter extends Filter {
  type = FILTER_TYPE.SEARCH;
  filterPredicate = (recipe: Recipe): boolean => {
    return (
      this.contains(recipe.name, this.value) ||
      this.contains(recipe.description, this.value) ||
      this.contains(recipe.type, this.value) ||
      !!recipe.categories.find(({ category }) => this.contains(category, this.value)) ||
      !!recipe.steps.find(({ step }) => this.contains(step, this.value)) ||
      !!recipe.ingredients.find(({ name }) => this.contains(name, this.value)) ||
      this.contains(recipe.author, this.value)
    );
  };
}
