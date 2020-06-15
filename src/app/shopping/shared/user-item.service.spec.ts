import { TestBed } from '@angular/core/testing';
import { UserItemService } from './user-item.service';
import { UserItem } from './user-item.model';
import { User } from 'src/app/user/shared/user.model';
import { of } from 'rxjs/internal/observable/of';
import { ActionService } from '@actionService';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';

describe('UserItemService', () => {
  let service: UserItemService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserItemService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserItems', () => {
    it('should get a user item' , () => {
      service.getUserItems('uid');
    });
  });

  describe('getUserItem', () => {
    it('should return an existing user item record', () => {
      const querySnapshot = {
        size: 1,
        forEach: () => {}
      };

      spyOn(querySnapshot, 'forEach');
      spyOn(service, 'postUserItem');

      service.getUserItem(querySnapshot, {next: () => {}}, 'uid', service);

      expect(querySnapshot.forEach).toHaveBeenCalled();
      expect(service.postUserItem).not.toHaveBeenCalled();
    });

    it('should create a user item record and return it', () => {
      const querySnapshot = {
        size: 0,
        doc: {
          data: () => {}
        }
      };

      spyOn(querySnapshot.doc, 'data');
      spyOn(service, 'postUserItem');

      service.getUserItem([], {next: () => {}}, 'uid', service);

      expect(querySnapshot.doc.data).not.toHaveBeenCalled();
      expect(service.postUserItem).toHaveBeenCalled();
    });
  });

  describe('postUserItem', () => {
    it('should create a user item record', () => {
      const userItem = new UserItem({});
      const ref = {
        doc: () => ref,
        set: () => {}
      };

      spyOn(service, 'getRef').and.returnValue(ref);
      spyOn(ref, 'doc').and.returnValue(ref);
      spyOn(ref, 'set');
      spyOn(userItem, 'getObject');

      service.postUserItem(userItem);

      expect(service.getRef).toHaveBeenCalled();
      expect(ref.doc).toHaveBeenCalled();
      expect(ref.set).toHaveBeenCalled();
      expect(userItem.getObject).toHaveBeenCalled();
    });
  });

  describe('putUserItem', () => {
    it('should update a user item record', () => {
      const userItem = new UserItem({});
      const ref = {
        doc: () => ref,
        set: () => {}
      };

      spyOn(service, 'getRef').and.returnValue(ref);
      spyOn(ref, 'doc').and.returnValue(ref);
      spyOn(ref, 'set');
      spyOn(userItem, 'getId');
      spyOn(userItem, 'getObject');

      service.putUserItem(userItem);

      expect(service.getRef).toHaveBeenCalled();
      expect(ref.doc).toHaveBeenCalled();
      expect(ref.set).toHaveBeenCalled();
      expect(userItem.getId).toHaveBeenCalled();
      expect(userItem.getObject).toHaveBeenCalled();
    });
  });

  describe('putUserItems', () => {
    it('should update user item records', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'putAll');

      service.putUserItems([new UserItem({})]);

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.putAll).toHaveBeenCalled();
    });
  });

  describe('buyUserItem', () => {
    it('should update a user item record', () => {
      const userItem = new UserItem({});
      const ref = {
        doc: () => ref,
        set: () => {}
      };

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'getRef').and.returnValue(ref);
      spyOn(ref, 'doc').and.returnValue(ref);
      spyOn(ref, 'set');
      spyOn(userItem, 'getId');
      spyOn(userItem, 'getObject');
      spyOn(actionService, 'commitAction');

      service.buyUserItem(userItem, 1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.getRef).toHaveBeenCalled();
      expect(ref.doc).toHaveBeenCalled();
      expect(ref.set).toHaveBeenCalled();
      expect(userItem.getId).toHaveBeenCalled();
      expect(userItem.getObject).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
    });

    it('should update a user item record and mark it as completed', () => {
      const userItem = new UserItem({});
      const ref = {
        doc: () => ref,
        set: () => {}
      };

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'getRef').and.returnValue(ref);
      spyOn(ref, 'doc').and.returnValue(ref);
      spyOn(ref, 'set');
      spyOn(userItem, 'getId');
      spyOn(userItem, 'getObject');
      spyOn(actionService, 'commitAction');

      service.buyUserItem(userItem, 1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.getRef).toHaveBeenCalled();
      expect(ref.doc).toHaveBeenCalled();
      expect(ref.set).toHaveBeenCalled();
      expect(userItem.getId).toHaveBeenCalled();
      expect(userItem.getObject).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
    });
  });
});
