import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { Household } from '@household';
import { Recipe } from '@recipe';
import { User } from '@user';
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

  describe('get', () => {
    it('should get docs based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
    });

    it('should get a default household based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));

      service.get('id').subscribe(doc => {
        expect(doc.id).toEqual('id');
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

  describe('hasPermission', () => {
    it('should return true when the household has the current user', () => {
      const household = new Household({ memberIds: 'uid'});
      const user = new User({ uid: 'uid' });
      const recipe = new Recipe({});

      const result = service.hasPermission(household, user, recipe);

      expect(result).toBeTrue();
    });

    it('should return true when the current user is the author', () => {
      const household = new Household({});
      const user = new User({ uid: 'uid' });
      const recipe = new Recipe({ uid: 'uid' });

      const result = service.hasPermission(household, user, recipe);
    
      expect(result).toBeTrue();
    });
  });
});
