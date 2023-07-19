import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NumberService {
  toDecimal(x: string | number): number {
    if (Number.isNaN(x)) {
      return 0;
    }

    if (typeof x !== 'string') {
      return x;
    }

    const wholeIndex = x.indexOf(' ');
    const f = x.slice(wholeIndex + 1);
    const i = f.indexOf('/');

    if (i === -1) {
      return Number(x);
    }
    if (wholeIndex === -1) {
      return Number(f.slice(0, i)) / Number(f.slice(i + 1));
    }
    return Number(x.slice(0, wholeIndex)) + Number(f.slice(0, i)) / Number(f.slice(i + 1));
  }

  toFraction(x: number): string {
    if (x === 0) {
      return '0';
    }

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

    const whole = Math.floor(num / den);
    num = num % den;

    if (den === 1) {
      return `${whole}`;
    }
    if (whole === 0) {
      return `${num}/${den}`;
    }
    return `${whole} ${num}/${den}`;
  }

  isValid(value: number | string): false | number {
    if (typeof value === 'string' && isNaN(Number(value))) {
      const fractionValue = this.toDecimal(value);
      if (isNaN(fractionValue)) {
        return false;
      }
      return Number(fractionValue.toFixed(4));
    }

    const number = Number(value);
    if (number < 0 || number > 999) {
      return false;
    }
    return Number(number.toFixed(6));
  }

  toFormattedFraction(value: number | string): string {
    let decimal = this.isValid(value);
    if (decimal === false) {
      return '-';
    }

    if (decimal <= 0.0001) {
      decimal = 0;
    }

    return this.toFraction(decimal);
  }
}
