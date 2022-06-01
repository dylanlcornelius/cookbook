import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ActionService } from '@actionService';
import { Action } from '@actions';
import { FirebaseService } from '@firebaseService';

describe('ActionService', () => {
  let service: ActionService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should set a ref', () => {
      firebase.appLoaded = true;

      spyOn(firebase, 'collection');

      service.load();

      expect(firebase.collection).toHaveBeenCalled();
    });

    it('should not set a ref', () => {
      spyOn(firebase, 'collection');

      service.load();

      expect(firebase.collection).not.toHaveBeenCalled();
    });
  });

  describe('commitAction', () => {
    it('should update an existing action', fakeAsync(() => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const week = (`${weekStart.getDate()}/${weekStart.getMonth() + 1}/${weekStart.getFullYear()}`).toString();

      const userActions = { uid: '', actions: { [week]: {[Action.BUY_INGREDIENT]: 1}}};

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
      const week = (`${weekStart.getDate()}/${weekStart.getMonth() + 1}/${weekStart.getFullYear()}`).toString();

      const userActions = { uid: '', actions: { [week]: {[Action.COMPLETE_SHOPPING_LIST]: 1}}};

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
      const userActions = { uid: '', actions: { ['different-week']: {[Action.BUY_INGREDIENT]: 1}}};

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

  describe('get', () => {
    it('should get a document', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(firebase, 'getDocs').and.returnValue(Promise.resolve([{ data: () => { return {}; } }]));

      service.get('uid');

      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(firebase.getDocs).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should add a document', () => {
      spyOn(firebase, 'addDoc');

      service.create({});

      expect(firebase.addDoc).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(firebase, 'doc');
      spyOn(firebase, 'setDoc');

      service.update({});

      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.setDoc).toHaveBeenCalled();
    });
  });
});
