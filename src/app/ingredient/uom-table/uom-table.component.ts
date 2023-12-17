import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NumberService } from '@numberService';
import { UOM, UOMs } from '@uoms';
import { UomService } from '@uomService';

@Component({
  selector: 'app-uom-table',
  templateUrl: './uom-table.component.html',
  styleUrls: ['./uom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UomTableComponent {
  uoms: UOMs;
  uomValue = 1;

  constructor(private numberService: NumberService, private uomService: UomService) {
    this.uoms = Object.values(UOM);
  }

  toDecimal = this.numberService.toDecimal;
  isValid = this.numberService.isValid;

  convert(from: UOM, to: UOM, value: number): string {
    let decimal = this.isValid(value);
    if (decimal === false) {
      return '-';
    }

    if (decimal <= 0.0001) {
      decimal = 0;
    }

    const result = this.uomService.convert(from, to, decimal);
    if (result === false) {
      return '-';
    }

    return this.numberService.toFraction(result);
  }
}
