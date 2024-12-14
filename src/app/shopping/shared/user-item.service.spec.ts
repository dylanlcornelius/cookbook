import { TestBed } from '@angular/core/testing';
import { UserItemService } from '@userItemService';
import { UserItem } from '@userItem';
import { User } from '@user';
import { of } from 'rxjs/internal/observable/of';
import { ActionService } from '@actionService';
import { FirestoreService } from '@firestoreService';
import { CurrentUserService } from '@currentUserService';
import { NotificationService } from '@modalService';
import { FirebaseService } from '@firebaseService';

describe('UserItemService', () => {
  let service: UserItemService;
  let firebase: FirebaseService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserItemService);
    firebase = TestBed.inject(FirebaseService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(UserItem);
    });
  });

  describe('getByUser', () => {
    it('should get documents based on a uid', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));

      service.getByUser('uid').subscribe((docs) => {
        expect(docs).toBeDefined();
      });
      -expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a user item record', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new UserItem({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
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
