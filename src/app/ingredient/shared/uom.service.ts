import { Injectable } from '@angular/core';
import { UOM } from '@uoms';

const uoms = {
  tsp: {
    tsp: 1,
    tbsp: 0.3333333333,
    'fl oz': 0.1666666667,
    c: 0.0208333,
    pt: 0.0104167,
    qt: 0.00520833,
    gal: 0.00130208,
    mL: 4.928922,
    L: 0.004928922,
  },
  tbsp: {
    tsp: 3,
    tbsp: 1,
    'fl oz': 0.5,
    c: 0.0625,
    pt: 0.03125,
    qt: 0.015625,
    gal: 0.00390625,
    mL: 14.78677,
    L: 0.01478676,
  },
  'fl oz': {
    tsp: 6,
    tbsp: 2,
    'fl oz': 1,
    c: 0.125,
    pt: 0.0625,
    qt: 0.03125,
    gal: 0.0078125,
    mL: 29.57353,
    L: 0.02957353,
  },
  c: {
    tsp: 48,
    tbsp: 16,
    'fl oz': 8,
    c: 1,
    pt: 0.5,
    qt: 0.25,
    gal: 0.0625,
    mL: 236.5882,
    L: 0.2365882,
  },
  pt: {
    tsp: 96,
    tbsp: 32,
    'fl oz': 16,
    c: 2,
    pt: 1,
    qt: 0.5,
    gal: 0.125,
    mL: 473.1765,
    L: 0.4731765,
  },
  qt: {
    tsp: 192,
    tbsp: 64,
    'fl oz': 32,
    c: 4,
    pt: 2,
    qt: 1,
    gal: 0.25,
    mL: 946.353,
    L: 0.946353,
  },
  gal: {
    tsp: 768,
    tbsp: 256,
    'fl oz': 128,
    c: 16,
    pt: 8,
    qt: 4,
    gal: 1,
    mL: 3785.412,
    L: 3.785412,
  },
  mL: {
    tsp: 0.2028841,
    tbsp: 0.06762804,
    'fl oz': 0.03381402,
    c: 0.004226753,
    pt: 0.002113376,
    qt: 0.001056688,
    gal: 0.000264172,
    mL: 1,
    L: 0.001,
  },
  L: {
    tsp: 202.8841,
    tbsp: 67.62804,
    'fl oz': 33.81402,
    c: 4.226753,
    pt: 2.113376,
    qt: 1.056688,
    gal: 0.264172,
    mL: 1000,
    L: 1,
  },
  oz: {
    oz: 1,
    lbs: 0.0625,
    g: 28.34952,
    kg: 0.02834952,
  },
  lbs: {
    oz: 16,
    lbs: 1,
    g: 453.5924,
    kg: 0.4535924,
  },
  g: {
    oz: 0.03527396,
    lbs: 0.002204623,
    g: 1,
    kg: 0.001,
  },
  kg: {
    oz: 35.27396,
    lbs: 2.204623,
    g: 1000,
    kg: 1,
  },
  other: {
    other: 1,
  },
  recipe: {
    recipe: 1,
  },
};

@Injectable({
  providedIn: 'root',
})
export class UomService {
  convert(fromUOM: UOM, toUOM: UOM, value: number): number | false {
    if (uoms[fromUOM] && uoms[fromUOM][toUOM]) {
      return uoms[fromUOM][toUOM] * value;
    }
    return false;
  }

  relatedUOMs(ingredientUOM: UOM): string[] {
    if (uoms[ingredientUOM]) {
      return Object.keys(uoms[ingredientUOM]);
    }
    return [];
  }
}
