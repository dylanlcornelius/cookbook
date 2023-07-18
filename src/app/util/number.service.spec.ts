import { TestBed } from '@angular/core/testing';

import { NumberService } from './number.service';

describe('NumberService', () => {
  let service: NumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('toDecimal', () => {
    it('should convert NaN to zero', () => {
      const result = service.toDecimal(NaN);

      expect(result).toEqual(0);
    });

    it('should not convert integers', () => {
      const result = service.toDecimal(1);

      expect(result).toEqual(1);
    });

    it('should convert a integer to a decimal', () => {
      const result = service.toDecimal('1');

      expect(result).toEqual(1);
    });

    it('should convert a fraction to a decimal', () => {
      const result = service.toDecimal('1/2');

      expect(result).toEqual(0.5);
    });

    it('should convert a proper fraction to a decimal', () => {
      const result = service.toDecimal('1 1/2');

      expect(result).toEqual(1.5);
    });
  });

  describe('toFraction', () => {
    it('should handle zeros', () => {
      const result = service.toFraction(0);

      expect(result).toEqual('0');
    });

    it('should handle whole numbers', () => {
      const result = service.toFormattedFraction(3);

      expect(result).toEqual('3');
    });

    it('should handle fractions', () => {
      const result = service.toFormattedFraction(0.5);

      expect(result).toEqual('1/2');
    });

    it('should handle proper fractions', () => {
      const result = service.toFormattedFraction(3.5);

      expect(result).toEqual('3 1/2');
    });
  });

  describe('isValid', () => {
    it('should handle an invalid fraction', () => {
      spyOn(service, 'toDecimal').and.returnValue(NaN);

      const result = service.isValid('@/1');

      expect(result).toEqual(false);
      expect(service.toDecimal).toHaveBeenCalled();
    });

    it('should return a valid fraction', () => {
      spyOn(service, 'toDecimal').and.returnValue(0.55555);

      const result = service.isValid('1/2');

      expect(result).toEqual(0.5555);
      expect(service.toDecimal).toHaveBeenCalled();
    });

    it('should handle an invalid decimal', () => {
      spyOn(service, 'toDecimal');

      const result = service.isValid('-1.5');

      expect(result).toEqual(false);
      expect(service.toDecimal).not.toHaveBeenCalled();
    });

    it('should return a valid decimal', () => {
      spyOn(service, 'toDecimal');

      const result = service.isValid('0.5555555');

      expect(result).toEqual(0.555555);
      expect(service.toDecimal).not.toHaveBeenCalled();
    });
  });

  describe('toFormattedFraction', () => {
    it('should handle invalid values', () => {
      spyOn(service, 'isValid').and.returnValue(false);
      spyOn(service, 'toFraction');

      const result = service.toFormattedFraction(0.5);

      expect(result).toEqual('-');
      expect(service.isValid).toHaveBeenCalled();
      expect(service.toFraction).not.toHaveBeenCalled();
    });

    it('should handle whole numbers', () => {
      spyOn(service, 'isValid').and.returnValue(0.00001);
      spyOn(service, 'toFraction').and.returnValue('3');

      const result = service.toFormattedFraction(0.5);

      expect(result).toEqual('3');
      expect(service.isValid).toHaveBeenCalled();
      expect(service.toFraction).toHaveBeenCalled();
    });
  });
});
