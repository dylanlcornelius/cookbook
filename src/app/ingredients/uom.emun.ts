export enum UOM {
    TEASPOON = 'tsp',
    TABLESPOON = 'tbsp',
    FLUID_OUNCE = 'fl_oz',
    CUP = 'c',
    PINT = 'pt',
    QUART = 'qt',
    GALLON = 'gal',
    OUNCE = 'oz',
    POUND = 'lbs',
    OTHER = 'other',
}

export class UOMConversion {
    uoms = {
        tsp: {
            tbsp: 0.3333333333,
            fl_oz: 0.1666666667,
            c: 0.0205372,
            pt: 0.0104167,
            qt: 0.00520833,
            gal: 0.00130208,
        },
        tbsp: {
            tsp: 3,
            fl_oz: 0.5,
            c: 0.0616115,
            pt: 0.03125,
            qt: 0.015625,
            gal: 0.00390625,
        },
        fl_oz: {
            tsp: 6,
            tbsp: 2,
            c: 0.123223,
            pt: 0.0625,
            qt: 0.03125,
            gal: 0.0078125,
        },
        c: {
            tsp: 48,
            tbsp: 16,
            fl_oz: 8,
            pt: 0.5,
            qt: 0.25,
            gal: 0.0625,
        },
        pt: {
            tsp: 96,
            tbsp: 32,
            fl_oz: 16,
            c: 2,
            qt: 0.5,
            gal: 0.125,
        },
        qt: {
            tsp: 192,
            tbsp: 64,
            fl_oz: 32,
            c: 4,
            pt: 2,
            gal: 0.25,
        },
        gal: {
            tsp: 768,
            tbsp: 256,
            fl_oz: 128,
            c: 16,
            pt: 8,
            qt: 4,
        },
        // add dry stoof
        oz: {
            lbs: 0.0625,
        },
        lbs: {
            oz: 16,
        },
    };

    convert(fromUOM: UOM, toUOM: UOM, value: number) {
        if (fromUOM === toUOM) {
            return value;
        }
        if (this.uoms[fromUOM] && this.uoms[fromUOM][toUOM]) {
            return this.uoms[fromUOM][toUOM] * value;
        }
        return false;
    }
}
