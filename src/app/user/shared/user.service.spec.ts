import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { UserService } from '@userService';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { User } from '@user';
import { FirebaseService } from '@firebaseService';

describe('UserService', () => {
  let service: UserService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
    });

    service = TestBed.inject(UserService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(User);
    });
  });

  describe('getByUser', () => {
    it('should get one document based on an id', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));

      service.getByUser('id').subscribe((doc) => {
        expect(doc).toBeDefined();
      });

      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });

    it('should handle a user id that does not match any documents', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([]));

      service.getByUser('id').subscribe((doc) => {
        expect(doc).toBeUndefined();
      });

      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new User({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new User({}), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new User({})]);

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
});
