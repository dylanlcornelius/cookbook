import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UomTableComponent } from './uom-table.component';
import { UOM, UOMConversion } from 'src/app/ingredient/shared/uom.emun';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('UomTableComponent', () => {
  let component: UomTableComponent;
  let fixture: ComponentFixture<UomTableComponent>;
  let uomConversion: UOMConversion;

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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toDecimal', () => {
    it('should convert a fraction to a decimal', () => {
      const result = component.toDecimal('1/2');

      expect(result).toEqual(0.5);
    });
  });

  describe('toFraction', () => {
    it('should convert a decimal to a fraction', () => {
      const result = component.toFraction(1.5);

      expect(result.whole).toEqual(1);
      expect(result.num).toEqual(1);
      expect(result.den).toEqual(2);
    });
  });

  describe('isValid', () => {
    it('should handle an invalid fraction', () => {
      spyOn(component, 'toDecimal').and.returnValue(NaN);

      const result = component.isValid('@/1');

      expect(result).toEqual(false);
      expect(component.toDecimal).toHaveBeenCalled();
    });
    
    it('should return a valid fraction', () => {
      spyOn(component, 'toDecimal').and.returnValue(0.55555);
    
      const result = component.isValid('1/2');

      expect(result).toEqual(0.5555);
      expect(component.toDecimal).toHaveBeenCalled();
    });

    it('should handle an invalid decimal', () => {
      spyOn(component, 'toDecimal');
     
      const result = component.isValid('-1.5');
   
      expect(result).toEqual(false);
      expect(component.toDecimal).not.toHaveBeenCalled();
    });

    it('should return a valid decimal', () => {
      spyOn(component, 'toDecimal');
     
      const result = component.isValid('0.5555555');

      expect(result).toEqual(0.555555);
      expect(component.toDecimal).not.toHaveBeenCalled();
    });
  });

  describe('convert', () => {
    it('should handle invalid values', () => {
      spyOn(component, 'isValid').and.returnValue(false);
      spyOn(uomConversion, 'convert');
      spyOn(component, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).not.toHaveBeenCalled();
      expect(component.toFraction).not.toHaveBeenCalled();
    });

    it('should handle invalid conversions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(false);
      spyOn(component, 'toFraction');

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('-');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(component.toFraction).not.toHaveBeenCalled();
    });

    it('should handle whole numbers', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(0.3);
      spyOn(component, 'toFraction').and.returnValue({ whole: 3, num: 1, den: 1 });

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('3');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(component.toFraction).toHaveBeenCalled();
    });

    it('should fractions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(0.3);
      spyOn(component, 'toFraction').and.returnValue({ whole: 0, num: 1, den: 2 });

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('1/2');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(component.toFraction).toHaveBeenCalled();
    });

    it('should proper fractions', () => {
      spyOn(component, 'isValid').and.returnValue(0.5);
      spyOn(uomConversion, 'convert').and.returnValue(0.3);
      spyOn(component, 'toFraction').and.returnValue({ whole: 3, num: 1, den: 2 });

      const result = component.convert(UOM.CUP, UOM.TABLESPOON, 0.5);

      expect(result).toEqual('3 1/2');
      expect(component.isValid).toHaveBeenCalled();
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(component.toFraction).toHaveBeenCalled();
    });
  });
});
