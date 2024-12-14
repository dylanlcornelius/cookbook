import { TestBed } from '@angular/core/testing';

import { UserIngredientService } from '@userIngredientService';
import { FirestoreService } from '@firestoreService';
import { UserIngredient } from '@userIngredient';
import { of } from 'rxjs';
import { CurrentUserService } from '@currentUserService';
import { ActionService } from '@actionService';
import { User } from '@user';
import { NotificationService } from '@modalService';
import { FirebaseService } from '@firebaseService';
import { Ingredient } from '@ingredient';

describe('UserIngredientService', () => {
  let service: UserIngredientService;
  let firebase: FirebaseService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserIngredientService);
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

      expect(result).toBeInstanceOf(UserIngredient);
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

      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new UserIngredient({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user ingredients', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new UserIngredient({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });

  describe('buildRecipeIngredients', () => {
    it('should build ingredients', () => {
      const userIngredients = [
        new UserIngredient({ ingredientId: 'id' }),
        new UserIngredient({ ingredientId: 'id2' }),
      ];
      const ingredients = [new Ingredient({ id: 'id' })];

      const result = service.buildUserIngredients(userIngredients, ingredients);

      expect(result.length).toEqual(1);
    });
  });

  describe('buyUserIngredient', () => {
    it('should update a user item record', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      service.buyUserIngredient(1, false);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(1);
      expect(notificationService.setModal).not.toHaveBeenCalled();
    });

    it('should update a user item record and mark it as completed', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(actionService, 'commitAction');
      spyOn(notificationService, 'setModal');

      service.buyUserIngredient(1, true);

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(actionService.commitAction).toHaveBeenCalledTimes(2);
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
