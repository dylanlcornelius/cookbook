import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { Navigation } from '@navigation';

import { NavigationService } from '@navigationService';
import { of } from 'rxjs';

describe('NavigationService', () => {
  let service: NavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getConfigs', () => {
    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Navigation({}));

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Navigation({})]);

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });

  describe('sort', () => {
    it('should sort two navs', () => {
      const result = service.sort(new Navigation({ order: 2 }), new Navigation({ order: 1 }));

      expect(result).toEqual(1)
    });
  });
});
