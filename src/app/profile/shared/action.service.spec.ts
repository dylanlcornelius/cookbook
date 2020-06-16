import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { ActionService } from 'src/app/profile/shared/action.service';
import { Action } from '@actions';

describe('ActionService', () => {
  let service: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('commitAction', () => {
    it('should update an existing action', fakeAsync(() => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear()).toString();

      const userActions = { actions: { [week]: {[Action.BUY_INGREDIENT]: 1}}};

      spyOn(service, 'getAction').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'postAction');
      spyOn(service, 'putAction');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.getAction).toHaveBeenCalled();
      expect(service.postAction).not.toHaveBeenCalled();
      expect(service.putAction).toHaveBeenCalled();
    }));

    it('should update a non-existing action', fakeAsync(() => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear()).toString();

      const userActions = { actions: { [week]: {[Action.COMPLETE_SHOPPING_LIST]: 1}}};

      spyOn(service, 'getAction').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'postAction');
      spyOn(service, 'putAction');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.getAction).toHaveBeenCalled();
      expect(service.postAction).not.toHaveBeenCalled();
      expect(service.putAction).toHaveBeenCalled();
    }));

    it('should update a non-existing week actions', fakeAsync(() => {
      const userActions = { actions: { ['different-week']: {[Action.BUY_INGREDIENT]: 1}}};

      spyOn(service, 'getAction').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'postAction');
      spyOn(service, 'putAction');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.getAction).toHaveBeenCalled();
      expect(service.postAction).not.toHaveBeenCalled();
      expect(service.putAction).toHaveBeenCalled();
    }));

    it('should create a new user action object', fakeAsync(() => {
      const userActions = null;

      spyOn(service, 'getAction').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'postAction');
      spyOn(service, 'putAction');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.getAction).toHaveBeenCalled();
      expect(service.postAction).toHaveBeenCalled();
      expect(service.putAction).not.toHaveBeenCalled();
    }));

    it('should not update or creating anything without a uid', () => {
      spyOn(service, 'getAction');
      spyOn(service, 'postAction');
      spyOn(service, 'putAction');

      service.commitAction('', Action.BUY_INGREDIENT, 1);

      expect(service.getAction).not.toHaveBeenCalled();
      expect(service.postAction).not.toHaveBeenCalled();
      expect(service.putAction).not.toHaveBeenCalled();
    });
  });

  describe('getActions', () => {
    it('should wrap getAction', () => {
      spyOn(service, 'getAction');

      service.getActions('uid');

      expect(service.getAction).toHaveBeenCalled();
    });
  });

  describe('postAction', () => {
    it('should add a document', () => {
      spyOn(service, 'getRef');

      service.postAction(service, {});

      expect(service.getRef).toHaveBeenCalled();
    });
  });

  describe('putAction', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');

      service.putAction(service, {});

      expect(service.getRef).toHaveBeenCalled();
    });
  });
});
