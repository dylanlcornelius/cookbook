import { TestBed } from '@angular/core/testing';
import { UOM } from '@uoms';

import { UomService } from './uom.service';

describe('UomService', () => {
  let service: UomService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UomService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convert', () => {
    it('should handle converting two equal uoms', () => {
      const result = service.convert(UOM.RECIPE, UOM.RECIPE, 1);

      expect(result).toEqual(1);
    });

    it('should convert different uoms', () => {
      const result = service.convert(UOM.POUND, UOM.OUNCE, 1);

      expect(result).toEqual(16);
    });

    it('should not convert invalid uoms', () => {
      const result = service.convert(UOM.RECIPE, UOM.OUNCE, 1);

      expect(result).toBeFalse();
    });
  });

  describe('relatedUOMs', () => {
    it('should find related uoms', () => {
      const result = service.relatedUOMs(UOM.RECIPE);

      expect(result).toBeDefined();
    });

    it('should not find any related uoms', () => {
      const result = service.relatedUOMs(null as any);

      expect(result).toEqual([]);
    });
  });
});
