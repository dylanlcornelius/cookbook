import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UOM, UOMConversion } from 'src/app/ingredient/shared/uom.emun';

@Component({
  selector: 'app-uom-table',
  templateUrl: './uom-table.component.html',
  styleUrls: ['./uom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UomTableComponent {
  uoms: Array<UOM>;
  uomValue = 1;

  constructor(private uomConversion: UOMConversion) {
    this.uoms = Object.values(UOM);
  }

  toDecimal(x) {
    const i = x.indexOf('/');
    return Number(x.slice(0, i)) / Number(x.slice(i + 1));
  }
  
  toFraction(x) {
    let num = 1;
    let den = 1;
    let r = 1;
    while (Math.abs((r - x) / x) > 0.001) {
      if (r < x) {
        num++;
      } else {
        den++;
      }

      r = num / den;
    }

    return { whole: Math.floor(num / den), num: (num % den), den };
  }

  isValid(value) {
    if (isNaN(Number(value))) {
      const fractionValue = this.toDecimal(value);
      if (isNaN(fractionValue)) {
        return false;
      }
      return Number(fractionValue.toFixed(4));
    }

    const number = Number(value);
    if (number <= 0 || number > 999) {
      return false;
    }
    return Number(number.toFixed(6));
  }

  convert(from: UOM, to: UOM, value: number) {
    const decimal = this.isValid(value);
    if (!decimal) {
      return '-';
    }

    const result = this.uomConversion.convert(from, to, decimal);
    if (result === false) {
      return '-';
    }

    const { whole, num, den } = this.toFraction(result);
    if (den === 1) {
      return `${whole}`;
    }
    if (whole === 0) {
      return `${num}/${den}`;
    }
    return `${whole} ${num}/${den}`;
  }
}
