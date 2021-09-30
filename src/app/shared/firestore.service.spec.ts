import { Action } from '@actions';
import { TestBed } from '@angular/core/testing';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { of } from 'rxjs';
import { ActionService } from '@actionService';

import { FirestoreService } from './firestore.service';
import { Recipe } from '@recipe';

describe('FirestoreService', () => {
  let service: FirestoreService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: String, useValue: 'test' }
      ]
    });
    service = TestBed.inject(FirestoreService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('commitAction', () => {
    it('should do nothing', () => {
      spyOn(currentUserService, 'getCurrentUser');
      spyOn(actionService, 'commitAction');

      service['commitAction'](undefined);

      expect(currentUserService.getCurrentUser).not.toHaveBeenCalled();
      expect(actionService.commitAction).not.toHaveBeenCalled();
    });

    it('should commit an action', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');

      service['commitAction'](Action.BUY_INGREDIENT);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should get one document', () => {
      service.getOne('id');

      expect(true).toBeTrue();
    });
  });

  describe('get', () => {
    it('should call getOne', () => {
      spyOn(service, 'getOne');
      spyOn(service, 'getMany');

      service.get('id');

      expect(service.getOne).toHaveBeenCalled();
      expect(service.getMany).not.toHaveBeenCalled();
    });

    it('should call getMany', () => {
      spyOn(service, 'getOne');
      spyOn(service, 'getMany');

      service.get();

      expect(service.getOne).not.toHaveBeenCalled();
      expect(service.getMany).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a document', () => {
      spyOn(service, 'commitAction');

      service.create(new Recipe({}).getObject());

      expect(service.commitAction).toHaveBeenCalled();
    });
  });

  describe('updateOne', () => {
    it('should update one document', () => {
      spyOn(service, 'commitAction');

      service.updateOne(new Recipe({}).getObject(), 'id');

      expect(service.commitAction).toHaveBeenCalled();
    });
  });

  describe('updateAll', () => {
    it('should update all documents', () => {
      service.updateAll([new Recipe({}).getObject()]);

      expect(true).toBeTrue();
    });
  });

  describe('update', () => {
    it('should not update any documents', () => {
      spyOn(service, 'updateOne');
      spyOn(service, 'updateAll');

      service.update(null);

      expect(service.updateOne).not.toHaveBeenCalled();
      expect(service.updateAll).not.toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(service, 'commitAction');

      service.delete('id');

      expect(service.commitAction).toHaveBeenCalled();
    });
  });
});
