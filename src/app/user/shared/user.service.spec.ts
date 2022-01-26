import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { UserService } from '@userService';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { User } from '@user';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ]
    });

    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getMany');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).not.toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });

    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
    });

    it('should get one document based on an id with a ref', () => {
      (<any>service.ref) = { where: () => {} };
     
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service.ref, 'where');

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.ref.where).toHaveBeenCalled();
    });

    it('should handle a user id that does not match any documents', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));
      spyOn(FirestoreService.prototype, 'get');

      service.get('id').subscribe(doc => {
        expect(doc).toBeUndefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
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
