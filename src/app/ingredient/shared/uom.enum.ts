import { Injectable } from "@angular/core";
export enum UOM {
    TEASPOON = 'tsp',
    TABLESPOON = 'tbsp',
    FLUID_OUNCE = 'fl oz',
    CUP = 'c',
    PINT = 'pt',
    QUART = 'qt',
    GALLON = 'gal',
    OUNCE = 'oz',
    POUND = 'lbs',
    OTHER = 'other',
    RECIPE = 'recipe',
}

@Injectable()
export class UOMConversion {
    uoms = {
        tsp: {
            tsp: 1,
            tbsp: 0.3333333333,
            'fl oz': 0.1666666667,
            c: 0.0208333,
            pt: 0.0104167,
            qt: 0.00520833,
            gal: 0.00130208,
        },
        tbsp: {
            tsp: 3,
            tbsp: 1,
            'fl oz': 0.5,
            c: 0.0625,
            pt: 0.03125,
            qt: 0.015625,
            gal: 0.00390625,
        },
        'fl oz': {
            tsp: 6,
            tbsp: 2,
            'fl oz': 1,
            c: 0.125,
            pt: 0.0625,
            qt: 0.03125,
            gal: 0.0078125,
        },
        c: {
            tsp: 48,
            tbsp: 16,
            'fl oz': 8,
            c: 1,
            pt: 0.5,
            qt: 0.25,
            gal: 0.0625,
        },
        pt: {
            tsp: 96,
            tbsp: 32,
            'fl oz': 16,
            c: 2,
            pt: 1,
            qt: 0.5,
            gal: 0.125,
        },
        qt: {
            tsp: 192,
            tbsp: 64,
            'fl oz': 32,
            c: 4,
            pt: 2,
            qt: 1,
            gal: 0.25,
        },
        gal: {
            tsp: 768,
            tbsp: 256,
            'fl oz': 128,
            c: 16,
            pt: 8,
            qt: 4,
            gal: 1,
        },
        oz: {
            oz: 1,
            lbs: 0.0625,
        },
        lbs: {
            oz: 16,
            lbs: 1,
        },
        other: {
            other: 1
        },
        recipe: {
            recipe: 1
        }
    };

    convert(fromUOM: UOM, toUOM: UOM, value: number): number | false {
        if (fromUOM === toUOM) {
            return value;
        }
        if (this.uoms[fromUOM] && this.uoms[fromUOM][toUOM]) {
            return this.uoms[fromUOM][toUOM] * value;
        }
        return false;
    }

    relatedUOMs(ingredientUOM: UOM): string[] {
        if (this.uoms[ingredientUOM]) {
            return Object.keys(this.uoms[ingredientUOM]);
        }
    }
}
