import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UomTableComponent } from './uom-table.component';
import { UOM, UOMConversion } from '@UOMConverson';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NumberService } from 'src/app/util/number.service';

describe('UomTableComponent', () => {
  let component: UomTableComponent;
  let fixture: ComponentFixture<UomTableComponent>;
  let uomConversion: UOMConversion;
  let numberService: NumberService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
      ],
      providers: [ UOMConversion ],
      declarations: [ UomTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    uomConversion = TestBed.inject(UOMConversion);
    numberService = TestBed.inject(NumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('convert', () => {
    it('should handle invalid values', () => {
      spyOn(component, 'isValid').and.returnValue(false);
      spyOn(uomConversion, 'convert');
      spyOn(numberService, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(numberService.toFraction).not.toHaveBeenCalled();
    });

    it('should handle invalid conversions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(numberService, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(numberService.toFraction).not.toHaveBeenCalled();
    });

    it('should handle small numbers', () => {
      spyOn(component, 'isValid').and.returnValue(0.00001);
      spyOn(uomConversion, 'convert').and.returnValue(0);
      spyOn(numberService, 'toFraction').and.returnValue('0');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.00001);

      expect(result).toEqual('0');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(numberService.toFraction).toHaveBeenCalled();
    });

    it('should handle fractions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(0.3);
      spyOn(numberService, 'toFraction').and.returnValue('1/2');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('1/2');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(numberService.toFraction).toHaveBeenCalled();
    });
  });
});
