import { Model } from '@model';
import { RecipeIngredient, RecipeIngredients } from '@recipeIngredient';
import { UOM } from '@uoms';

export class Recipe extends Model {
  name: string;
  link: string;
  description: string;
  time: string;
  servings: string;
  type: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isDairyFree: boolean;
  isServedHot: boolean;
  isServedRoom: boolean;
  isServedCold: boolean;
  categories: Array<{
    category: string;
  }>;
  steps: Array<{
    step?: string;
    recipeId?: string;

    // calculated fields
    recipeName?: string;
    recipeSteps?: Recipe['steps'];
    isExpanded?: boolean;
    isSelected?: boolean;
  }>;
  ingredients: RecipeIngredients;

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
  calories: number;
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
    this.servings = data.servings || '';
    this.categories = data.categories || [];
    this.steps = data.steps || [];
    this.ingredients = (data.ingredients || []).map(ingredient => new RecipeIngredient(ingredient));
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
    this.isServedHot = data.isServedHot || false;
    this.isServedRoom = data.isServedRoom || false;
    this.isServedCold = data.isServedCold || false;
    this.type = data.type || '';
    this.hasNewCategory = data.hasNewCategory || false;
    this.hasNeedsImageCategory = data.hasNeedsImageCategory || false;
  }

  public getObject(): RecipeObject {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      id,
      calories,
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
    return {
      ...recipe,
      ingredients: recipe.ingredients.map(ingredient => ingredient.getObject()),
      steps: recipe.steps.map(({ step, recipeId }) => (recipeId ? { recipeId } : { step })),
    };
  }
}

export type RecipeObject = Omit<
  Recipe,
  | 'id'
  | 'getId'
  | 'getObject'
  | 'calories'
  | 'image'
  | 'amount'
  | 'uom'
  | 'hasAuthorPermission'
  | 'hasNewCategory'
  | 'hasNeedsImageCategory'
  | 'displayType'
>;
export type Recipes = Recipe[];

export enum RECIPE_STATUS {
  PUBLISHED = 'published',
  PRIVATE = 'private',
  BLUEPRINT = 'blueprint',
}

export const RestrictionLabels = [
  { displayName: 'Vegetarian', name: 'isVegetarian' },
  { displayName: 'Vegan', name: 'isVegan' },
  { displayName: 'Gluten Free', name: 'isGlutenFree' },
  { displayName: 'Dairy Free', name: 'isDairyFree' },
] as const;

export const TemperatureLabels = [
  { displayName: 'Hot', name: 'isServedHot' },
  { displayName: 'Room Temperature', name: 'isServedRoom' },
  { displayName: 'Cold', name: 'isServedCold' },
] as const;
