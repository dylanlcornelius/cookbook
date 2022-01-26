import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TutorialService } from '@tutorialService';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { NumberService } from 'src/app/util/number.service';

@Component({
  selector: 'app-uom-table',
  templateUrl: './uom-table.component.html',
  styleUrls: ['./uom-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UomTableComponent {
  uoms: Array<UOM>;
  uomValue = 1;

  constructor(
    private numberService: NumberService,
    private uomService: UomService,
    private tutorialService: TutorialService,
  ) {
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

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
