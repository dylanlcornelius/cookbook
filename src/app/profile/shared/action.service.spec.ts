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

      spyOn(service, 'get').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    }));

    it('should update a non-existing action', fakeAsync(() => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (weekStart.getDate() + '/' + (weekStart.getMonth() + 1) + '/' + weekStart.getFullYear()).toString();

      const userActions = { actions: { [week]: {[Action.COMPLETE_SHOPPING_LIST]: 1}}};

      spyOn(service, 'get').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    }));

    it('should update a non-existing week actions', fakeAsync(() => {
      const userActions = { actions: { ['different-week']: {[Action.BUY_INGREDIENT]: 1}}};

      spyOn(service, 'get').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    }));

    it('should create a new user action object', fakeAsync(() => {
      const userActions = null;

      spyOn(service, 'get').and.returnValue(Promise.resolve(userActions));
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.commitAction('uid', Action.BUY_INGREDIENT, 1);

      tick();
      expect(service.get).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    }));

    it('should not update or creating anything without a uid', () => {
      spyOn(service, 'get');
      spyOn(service, 'create');
      spyOn(service, 'update');

      service.commitAction('', Action.BUY_INGREDIENT, 1);

      expect(service.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.update).not.toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should add a document', () => {
      const ref = spyOnProperty(service, 'ref');

      service.create({});

      expect(ref).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      const ref = spyOnProperty(service, 'ref');

      service.update({});

      expect(ref).toHaveBeenCalled();
    });
  });
});
