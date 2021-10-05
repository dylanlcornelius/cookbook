import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get the loading value', () => {
      service.get().subscribe(loading => {
        expect(loading).toBeFalse();
      });
    });
  });

  describe('set', () => {
    it('should set the loading value', () => {
      const result = service.set(true);

      expect(result).toBeTrue();
    });
  });
});
