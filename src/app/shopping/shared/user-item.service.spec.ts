import { TestBed, fakeAsync, tick } from '@angular/core/testing';
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

  describe('get', () => {
    it('should return an existing user item record', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create a user item record and return it', fakeAsync(() => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([]));
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));

    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user item record', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'create');

      service.create(new UserItem({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user item record', () => {
      const userItem = new UserItem({});

      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'update');
      spyOn(userItem, 'getId');
      spyOn(userItem, 'getObject');

      service.update(userItem);

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.update).toHaveBeenCalled();
      expect(userItem.getId).toHaveBeenCalled();
      expect(userItem.getObject).toHaveBeenCalled();
    });

    it('should update user item records', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'updateAll');

      service.update([new UserItem({})]);

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.updateAll).toHaveBeenCalled();
    });
  });

  describe('buyUserItem', () => {
    it('should update a user item record', () => {
      const userItem = new UserItem({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'update');
      spyOn(actionService, 'commitAction');

      service.buyUserItem(userItem, 1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
    });

    it('should update a user item record and mark it as completed', () => {
      const userItem = new UserItem({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(service, 'update');
      spyOn(actionService, 'commitAction');

      service.buyUserItem(userItem, 1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
    });
  });
});
