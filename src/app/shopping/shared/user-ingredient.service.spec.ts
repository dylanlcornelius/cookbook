import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserIngredientService } from '@userIngredientService';
import { FirestoreService } from '@firestoreService';
import { UserIngredient } from '@userIngredient';
import { of } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { User } from '@user';
import { Ingredient } from '@ingredient';

describe('UserIngredientService', () => {
  let service: UserIngredientService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIngredientService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create a document if none are found', fakeAsync(() => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create').and.returnValue('id');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));

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

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new UserIngredient({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new UserIngredient({}), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update user ingredients', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new UserIngredient({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('formattedUpdate', () => {
    it('should update with formatted data', () => {
      spyOn(service, 'update');

      service.formattedUpdate([new Ingredient({})], '', '');

      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('buyUserIngredient', () => {
    it('should update a user item record', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');

      service.buyUserIngredient(1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
    });

    it('should update a user item record and mark it as completed', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');

      service.buyUserIngredient(1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
    });
  });
});
