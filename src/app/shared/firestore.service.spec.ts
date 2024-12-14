import { Action } from '@actions';
import { ActionService } from '@actionService';
import { TestBed } from '@angular/core/testing';
import { CurrentUserService } from '@currentUserService';
import { FirebaseService } from '@firebaseService';
import { Model } from '@model';
import { Recipe } from '@recipe';
import { User } from '@user';
import { DocumentReference, Query } from 'firebase/firestore';
import { of } from 'rxjs';
import { FirestoreService } from './firestore.service';

describe('FirestoreService', () => {
  let service: FirestoreService<Model>;
  let firebase: FirebaseService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: String, useValue: 'test' },
        { provide: Function, useValue: (data: any) => new Model(data) },
      ],
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

  describe('getById', () => {
    it('should get one document', () => {
      spyOn(firebase, 'doc');
      spyOn(firebase, 'onSnapshot').and.returnValue(of({ data: () => {}, id: 'id' }) as any);

      service.getById('id').subscribe((data) => {
        expect(data.id).toEqual('id');
      });

      expect(firebase.doc).toHaveBeenCalled();
      expect(firebase.onSnapshot).toHaveBeenCalled();
    });
  });

  describe('getByQuery', () => {
    it('should get one document', () => {
      spyOn(firebase, 'onSnapshot').and.returnValue(of([{ data: () => {}, id: 'id' }] as any));

      service.getByQuery({} as Query<Model>).subscribe((data) => {
        expect(data[0].id).toEqual('id');
      });

      expect(firebase.onSnapshot).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should get one document', () => {
      spyOn(firebase, 'onSnapshot').and.returnValue(of([{ data: () => {}, id: 'id' }] as any));

      service.getAll().subscribe((data) => {
        expect(data[0].id).toEqual('id');
      });

      expect(firebase.onSnapshot).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a document', () => {
      spyOn(service, 'commitAction');
      spyOn(firebase, 'doc').and.returnValue({} as DocumentReference<Model>);
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

      service.update(new Recipe({}).getObject());

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
