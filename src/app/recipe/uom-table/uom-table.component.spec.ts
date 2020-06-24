import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UomTableComponent } from './uom-table.component';
import { UOM, UOMConversion } from 'src/app/ingredient/shared/uom.emun';
import { FormsModule } from '@angular/forms';

describe('UomTableComponent', () => {
  let component: UomTableComponent;
  let fixture: ComponentFixture<UomTableComponent>;
  let uomConversion: UOMConversion;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
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

  describe('convert', () => {
    it('should convert a valid value', () => {
      spyOn(uomConversion, 'convert').and.returnValue(1);
  
      component.convert(UOM.CUP, UOM.FLUID_OUNCE, 1);
  
      expect(uomConversion.convert).toHaveBeenCalled();
    });
  
    it('should handle an invalid value', () => {
      spyOn(uomConversion, 'convert').and.returnValue(false);
  
      const result = component.convert(UOM.CUP, UOM.FLUID_OUNCE, 1);
  
      expect(uomConversion.convert).toHaveBeenCalled();
      expect(result).toEqual('-');
    });

    it('should handle no value', () => {
      spyOn(uomConversion, 'convert').and.returnValue(false);
  
      component.convert(UOM.CUP, UOM.FLUID_OUNCE, undefined);
  
      expect(uomConversion.convert).toHaveBeenCalled();
    });
  });
});
