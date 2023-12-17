import { Model } from '@model';

export class RecipeHistory extends Model {
  uid: string;
  recipeId: string;
  history: string[];
  timesCooked: number;
  lastDateCooked: string;

  constructor(data: any = {}) {
    super(data);
    this.uid = data.uid;
    this.recipeId = data.recipeId;
    this.history = data.history || [];
    this.timesCooked = data.timesCooked || 0;
    this.lastDateCooked = data.lastDateCooked || '';
  }
}

export type RecipeHistories = RecipeHistory[];
