import { Action } from '@actions';
import { TestBed } from '@angular/core/testing';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { of } from 'rxjs';
import { ActionService } from '@actionService';

import { FirestoreService } from './firestore.service';

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
});
