import { Model } from '@model';
import { Ingredient } from '@ingredient';
import { UOM } from '@uoms';

export class Recipe extends Model {
  name: string;
  link: string;
  description: string;
  time: string;
  servings: string;
  calories: string;
  type: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  categories: Array<{
    category: string;
  }>;
  steps: Array<{
    step: string;
  }>;
  ingredients: Array<Ingredient>;

  // uneditable fields
  uid: string;
  author: string;
  status: RECIPE_STATUS;
  hasImage: boolean;
  meanRating: number;
  ratings: Array<{
    uid: string;
    rating: number;
  }>;

  // calculated fields
  count: number;
  image: string;
  amount = '1';
  uom = UOM.RECIPE;
  hasAuthorPermission: boolean;
  hasNewCategory: boolean;
  hasNeedsImageCategory: boolean;
  displayType: string;

  constructor(data: any) {
    super(data);
    this.name = data.name || '';
    this.link = data.link || '';
    this.description = data.description || '';
    this.time = data.time || '';
    this.calories = data.calories || '';
    this.servings = data.servings || '';
    this.categories = data.categories || [];
    this.steps = data.steps || [];
    this.ingredients = data.ingredients || [];
    this.hasImage = data.hasImage || false;
    this.meanRating = data.meanRating || 0;
    this.ratings = data.ratings || [];
    this.uid = data.uid || '';
    this.author = data.author || '';
    this.status = data.status || RECIPE_STATUS.PRIVATE;
    this.isVegetarian = data.isVegetarian || false;
    this.isVegan = data.isVegan || false;
    this.isGlutenFree = data.isGlutenFree || false;
    this.isDairyFree = data.isDairyFree || false;
    this.type = data.type || '';
    this.hasNewCategory = data.hasNewCategory || false;
    this.hasNeedsImageCategory = data.hasNeedsImageCategory || false;
  }

  public getObject(): RecipeObject {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      id,
      count,
      image,
      amount,
      uom,
      hasAuthorPermission,
      hasNewCategory,
      hasNeedsImageCategory,
      displayType,
      ...recipe
    } = this;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return recipe;
  }
}

export type RecipeObject = Omit<
  Recipe,
  | 'id'
  | 'getId'
  | 'getObject'
  | 'count'
  | 'image'
  | 'amount'
  | 'uom'
  | 'hasAuthorPermission'
  | 'hasNewCategory'
  | 'hasNeedsImageCategory'
  | 'displayType'
>;

export enum RECIPE_STATUS {
  PUBLISHED = 'published',
  PRIVATE = 'private',
  BLUEPRINT = 'blueprint',
}
