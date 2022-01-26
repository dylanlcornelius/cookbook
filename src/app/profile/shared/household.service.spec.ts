import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { Household } from '@household';
import { Recipe, RECIPE_STATUS } from '@recipe';
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
      spyOn(FirestoreService.prototype, 'get');

      service.get('id').subscribe(doc => {
        expect(doc.id).toEqual('id');
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getMany');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).not.toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
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

  describe('hasAuthorPermission', () => {
    it('should return true when the household has the current user', () => {
      const household = new Household({ memberIds: 'uid'});
      const user = new User({ uid: 'uid' });
      const recipe = new Recipe({});

      const result = service.hasAuthorPermission(household, user, recipe);

      expect(result).toBeTrue();
    });

    it('should return true when the current user is the author', () => {
      const household = new Household({});
      const user = new User({ uid: 'uid' });
      const recipe = new Recipe({ uid: 'uid' });

      const result = service.hasAuthorPermission(household, user, recipe);
    
      expect(result).toBeTrue();
    });

    it('should return true when the recipe is a blueprint recipe', () => {
      const household = new Household({});
      const user = new User({ uid: 'uid' });
      const recipe = new Recipe({ status: RECIPE_STATUS.BLUEPRINT });

      const result = service.hasAuthorPermission(household, user, recipe);
    
      expect(result).toBeTrue();
    });
  });

  describe('hasUserPermission', () => {
    it('should return true when user has author permissions', () => {
      const household = new Household({});
      const user = new User({});
      const recipe = new Recipe({});

      spyOn(service, 'hasAuthorPermission').and.returnValue(true);

      const result = service.hasUserPermission(household, user, recipe);

      expect(service.hasAuthorPermission).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return true when the recipe is published', () => {
      const household = new Household({});
      const user = new User({});
      const recipe = new Recipe({ status: RECIPE_STATUS.PUBLISHED });

      spyOn(service, 'hasAuthorPermission').and.returnValue(false);
      
      const result = service.hasUserPermission(household, user, recipe);
    
      expect(service.hasAuthorPermission).toHaveBeenCalled();
      expect(result).toBeTrue();
    });

    it('should return false when the recipe is a blueprint recipe', () => {
      const household = new Household({});
      const user = new User({});
      const recipe = new Recipe({ status: RECIPE_STATUS.BLUEPRINT });

      spyOn(service, 'hasAuthorPermission').and.returnValue(true);
      
      const result = service.hasUserPermission(household, user, recipe);
    
      expect(service.hasAuthorPermission).toHaveBeenCalled();
      expect(result).toBeFalse();
    });
  });
});
