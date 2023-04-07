import { Action } from '@actions';
import { TestBed } from '@angular/core/testing';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';
import { of } from 'rxjs';
import { ActionService } from '@actionService';

import { FirestoreService } from './firestore.service';
import { Recipe } from '@recipe';
import { FirebaseService } from '@firebaseService';

describe('FirestoreService', () => {
  let service: FirestoreService;
  let firebase: FirebaseService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: String, useValue: 'test' }
      ]
    });
    service = TestBed.inject(FirestoreService);
    firebase = TestBed.inject(FirebaseService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('load', () => {
    it('should set a collection ref', () => {
      firebase.appLoaded = true;

      spyOn(firebase, 'collection');

      service.load();

      expect(firebase.collection).toHaveBeenCalled();
    });

    it('should set a collection ref', () => {
      spyOn(firebase, 'collection');

      service.load();

      expect(firebase.collection).not.toHaveBeenCalled();
    });
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
      spyOn(firebase, 'doc');
      spyOn(firebase, 'onSnapshot').and.returnValue(of({ data: () => {}, id: 'id' }));

      service.getOne('id').subscribe(data => {
        expect(data.id).toEqual('id');
      });

      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.onSnapshot).toHaveBeenCalled();
    });
  });

  describe('getMany', () => {
    it('should get one document', () => {
      spyOn(firebase, 'onSnapshot').and.returnValue(of([{ data: () => {}, id: 'id' }]));

      service.getMany().subscribe(data => {
        expect(data[0].id).toEqual('id');
      });

      expect(firebase.onSnapshot).toHaveBeenCalled();
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
      spyOn(firebase, 'doc').and.returnValue({});
      spyOn(firebase, 'setDoc');

      service.create(new Recipe({}).getObject());

      expect(service.commitAction).toHaveBeenCalled();
      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.setDoc).toHaveBeenCalled();
    });
  });

  describe('updateOne', () => {
    it('should update one document', () => {
      spyOn(service, 'commitAction');

      spyOn(firebase, 'doc');
      spyOn(firebase, 'setDoc');

      service.updateOne(new Recipe({}).getObject(), 'id');

      expect(service.commitAction).toHaveBeenCalled();
      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.setDoc).toHaveBeenCalled();
    });
  });

  describe('updateAll', () => {
    it('should update all documents', () => {
      spyOn(firebase, 'doc');
      spyOn(firebase, 'setDoc');

      service.updateAll([new Recipe({}), new Recipe({})]);

      expect(firebase.doc).toHaveBeenCalledTimes(2);
      expect(firebase.setDoc).toHaveBeenCalledTimes(2);
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
      spyOn(firebase, 'doc');
      spyOn(firebase, 'deleteDoc');

      service.delete('id');

      expect(service.commitAction).toHaveBeenCalled();
      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.deleteDoc).toHaveBeenCalled();
    });
  });
});
