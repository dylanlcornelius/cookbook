import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { UserIngredientService } from './user-ingredient.service';
import { FirestoreService } from '@firestoreService';
import { UserIngredient } from './user-ingredient.model';
import { of } from 'rxjs';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { ActionService } from '@actionService';
import { User } from 'src/app/user/shared/user.model';

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
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create a document if none are found', fakeAsync(() => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([]));
      spyOn(service, 'create').and.returnValue('id');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));

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

      service.create(new UserIngredient({}));

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'update');

      service.update(new UserIngredient({}));

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.update).toHaveBeenCalled();
    });

    it('should update user ingredients', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new UserIngredient({})]);

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('buyUserIngredient', () => {
    it('should update a user item record', () => {
      const userItem = new UserIngredient({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'update');
      spyOn(actionService, 'commitAction');

      service.buyUserIngredient(userItem, 1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
    });

    it('should update a user item record and mark it as completed', () => {
      const userItem = new UserIngredient({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'update');
      spyOn(actionService, 'commitAction');

      service.buyUserIngredient(userItem, 1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
    });
  });
});
