import { TestBed } from '@angular/core/testing';

import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
  let service: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should call getOne', () => {
      spyOn(service, 'getOne');
      spyOn(service, 'getMany');

      service.get({}, 'id');

      expect(service.getOne).toHaveBeenCalled();
      expect(service.getMany).not.toHaveBeenCalled();
    });

    it('should call getMany', () => {
      spyOn(service, 'getOne');
      spyOn(service, 'getMany');

      service.get({});

      expect(service.getOne).not.toHaveBeenCalled();
      expect(service.getMany).toHaveBeenCalled();
    });
  });
});
