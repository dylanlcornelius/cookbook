import { Model } from '@model';
import { UOM } from '@uoms';

export class RecipeIngredient extends Model {
  id: string;
  quantity: string;
  uom: UOM;
  isOptional: boolean;

  name: string;
  selected: boolean;

  constructor(data: any) {
    super(data);
    this.id = data.id || '';
    this.quantity = data.quantity;
    this.uom = data.uom || '';
    this.isOptional = data.isOptional || false;
    this.name = data.name || '';
    this.selected = data.selected || false;
  }

  public getObject(): RecipeIngredientObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, selected, ...recipeIngredient } = this;

    return recipeIngredient;
  }
}

export type RecipeIngredientObject = Omit<
  RecipeIngredient,
  'id' | 'getId' | 'getObject' | 'name' | 'selected'
>;
export type RecipeIngredients = RecipeIngredient[];
