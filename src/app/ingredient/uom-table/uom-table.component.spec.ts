import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UomTableComponent } from './uom-table.component';
import { UOM } from '@uoms';
import { UomService } from '@uomService';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { RouterModule } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NumberService } from '@numberService';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('UomTableComponent', () => {
  let component: UomTableComponent;
  let fixture: ComponentFixture<UomTableComponent>;
  let uomService: UomService;
  let numberService: NumberService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [UomTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    uomService = TestBed.inject(UomService);
    numberService = TestBed.inject(NumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('convert', () => {
    it('should handle invalid values', () => {
      spyOn(component, 'isValid').and.returnValue(false);
      spyOn(uomService, 'convert');
      spyOn(numberService, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomService.convert).not.toHaveBeenCalled();
      expect(numberService.toFraction).not.toHaveBeenCalled();
    });

    it('should handle invalid conversions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomService, 'convert').and.returnValue(false);
      spyOn(numberService, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(numberService.toFraction).not.toHaveBeenCalled();
    });

    it('should handle small numbers', () => {
      spyOn(component, 'isValid').and.returnValue(0.00001);
      spyOn(uomService, 'convert').and.returnValue(0);
      spyOn(numberService, 'toFraction').and.returnValue('0');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.00001);

      expect(result).toEqual('0');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(numberService.toFraction).toHaveBeenCalled();
    });

    it('should handle fractions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomService, 'convert').and.returnValue(0.3);
      spyOn(numberService, 'toFraction').and.returnValue('1/2');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('1/2');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomService.convert).toHaveBeenCalled();
      expect(numberService.toFraction).toHaveBeenCalled();
    });
  });
});
