import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserItemService } from '@userItemService';
import { UserItem } from '@userItem';
import { User } from '@user';
import { of } from 'rxjs/internal/observable/of';
import { ActionService } from '@actionService';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { NotificationService } from '@modalService';

describe('UserItemService', () => {
  let service: UserItemService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserItemService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return an existing user item record', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });
-
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should return an existing user item record with a ref', () => {
      (<any>service.ref) = { where: () => {} };
    
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');
      spyOn(service.ref, 'where');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });
-
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.ref.where).toHaveBeenCalled();
    });

    it('should create a user item record and return it', fakeAsync(() => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getMany');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).not.toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user item record', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new UserItem({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user item record', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new UserItem({}), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update user item records', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new UserItem({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('formattedUpdate', () => {
    it('should update with formatted data', () => {
      spyOn(service, 'update');

      service.formattedUpdate([{ name: undefined }], '', '');

      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('buyUserItem', () => {
    it('should update a user item record', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      service.buyUserItem(1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });

    it('should update a user item record and mark it as completed', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      service.buyUserItem(1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
