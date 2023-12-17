import { Model } from '@model';
import { Recipes } from '@recipe';

export class MealPlan extends Model {
  uid: string;
  recipes: Recipes;

  constructor(data: any) {
    super(data);
    this.uid = data.uid;
    this.recipes = data.recipes || [];
  }
}

export type MealPlans = MealPlan[];
