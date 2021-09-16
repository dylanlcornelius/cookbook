import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { Household } from '@household';
import { of } from 'rxjs';

import { HouseholdService } from './household.service';

describe('HouseholdService', () => {
  let service: HouseholdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HouseholdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getId', () => {
    it('should get a household id', () => {
      spyOn(service, 'get').and.returnValue(of(new Household({ id: 'householdId' })));

      service.getId('uid').subscribe(householdId => {
        expect(householdId).toEqual('householdId');
      });

      expect(service.get).toHaveBeenCalled();
    });

    it('should default a household id', () => {
      spyOn(service, 'get').and.returnValue(of(undefined));

      service.getId('uid').subscribe(householdId => {
        expect(householdId).toEqual('uid');
      });

      expect(service.get).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should get docs based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
    });

    it('should get no docs based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));

      service.get('id').subscribe(doc => {
        expect(doc).toBeUndefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
    });
  });

  describe('getInvites', () => {
    it('should get docs based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));

      service.getInvites('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Household({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new Household({}).getObject(), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Household({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });
});
