export enum VOLUME_UOM {
  TEASPOON = 'tsp',
  TABLESPOON = 'tbsp',
  FLUID_OUNCE = 'fl oz',
  CUP = 'c',
  PINT = 'pt',
  QUART = 'qt',
  GALLON = 'gal',
  MILLILITER = 'mL',
  LITER = 'L',
  OTHER = 'other',
}
export type VOLUME_UOMs = VOLUME_UOM[];

export enum WEIGHT_UOM {
  OUNCE = 'oz',
  POUND = 'lbs',
  GRAM = 'g',
  KILOGRAM = 'kg',
}
export type WEIGHT_UOMs = WEIGHT_UOM[];

enum OTHER_UOM {
  RECIPE = 'recipe',
}

export const UOM = { ...VOLUME_UOM, ...WEIGHT_UOM, ...OTHER_UOM };
export type UOM = VOLUME_UOM | WEIGHT_UOM | OTHER_UOM;

export type UOMs = UOM[];
