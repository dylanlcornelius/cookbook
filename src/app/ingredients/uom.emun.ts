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

// enum UOM_Conversion {
//     tsp = 3,
//     tbsp = 2,
//     fl_oz = 8,
//     c = 2,
//     pint = 2,
//     quart = 4,
//     oz = 16,
// }

export class UOMConversion {
    fluidUOMs = [
        'tsp',
        'tbsp',
        'fl_oz',
        'c',
        'pt',
        'qt',
    ];

    fluidValues = {
        tsp: 3,
        tbsp: 2,
        fl_oz: 8,
        c: 2,
        pt: 2,
        qt: 4,
    };

    dryUOMs = [
        'oz'
    ];

    dryValues = [
        16
    ];

    convert(fromUOM: UOM, toUOM: UOM, value: number): number {
        let currentValue;
        let result = value;

        console.log(this.fluidUOMs.indexOf(fromUOM));
        console.log(this.fluidUOMs.indexOf(toUOM));

        if (this.fluidUOMs.indexOf(fromUOM) < this.fluidUOMs.indexOf(toUOM)) {
            for (let currentUOM = this.fluidUOMs.indexOf(fromUOM); currentUOM < this.fluidUOMs.indexOf(toUOM); currentUOM++) {
                currentValue = this.fluidValues[currentUOM];
                result /= currentValue;
                console.log(currentUOM);
            }
        } else {
            for (let currentUOM = this.fluidUOMs.indexOf(fromUOM); currentUOM < this.fluidUOMs.indexOf(toUOM); currentUOM--) {
                currentValue = this.fluidValues[currentUOM];
                result *= currentValue;
                console.log(currentUOM);
            }
        }

        // while (currentUOM !== toUOM.toString()) {
        //     currentValue = this.fluidValues[currentUOM];

        //     if (this.fluidUOMs.indexOf(currentUOM) < this.fluidUOMs.indexOf(toUOM)) {
        //         result /= currentValue;
        //         currentUOM = this.fluidUOMs[this.fluidUOMs.indexOf(currentUOM) + 1];
        //     } else {
        //         result *= currentValue;
        //         currentUOM = this.fluidUOMs[this.fluidUOMs.indexOf(currentUOM) - 1];
        //     }
        //     console.log(currentUOM);
        //     console.log(toUOM.toString());
        // }

        console.log(result);
        return result;
    }
}
