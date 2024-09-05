import { Model } from '@model';
import { UOM } from '@uoms';

export class RecipeIngredient extends Model {
  id: string;
  quantity: string;
  uom: UOM;
  isOptional: boolean;

  name: string;
  volumeUnit: UOM;
  weightUnit: UOM;
  selected: boolean;
  disabled: boolean;

  constructor(data: any) {
    super(data);
    this.id = data.id || '';
    this.quantity = data.quantity;
    this.uom = data.uom || '';
    this.isOptional = data.isOptional || false;
    this.name = data.name || '';
    this.volumeUnit = data.volumeUnit || '';
    this.weightUnit = data.weightUnit || '';
    this.selected = data.selected || false;
    this.disabled = data.disabled || false;
  }

  public getObject(): RecipeIngredientObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { name, selected, disabled, ...recipeIngredient } = this;

    return recipeIngredient;
  }
}

export type RecipeIngredientObject = Omit<
  RecipeIngredient,
  'id' | 'getId' | 'getObject' | 'name' | 'selected' | 'disabled'
>;
export type RecipeIngredients = RecipeIngredient[];
