import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UOM, UOMConversion } from 'src/app/ingredient/shared/uom.emun';
import Fraction from 'fraction.js';

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

  convert(from: UOM, to: UOM, value: number) {
    const result = this.uomConversion.convert(from, to, value || 1);
    return result ? new Fraction(result).simplify(0.001).toFraction(true) : '-';
  }
}
