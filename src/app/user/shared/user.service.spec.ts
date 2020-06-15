import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { UserService } from '@userService';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { User } from './user.model';

describe('UserService', () => {
  let service: UserService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ]
    });

    service = TestBed.inject(UserService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should get all documents', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getUsers().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  xdescribe('getUser', () => {
    it('should get one document based on an id', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.getUser('id').then(doc => {
        expect(doc).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('postUser', () => {
    it('should create a new document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'post');

      service.postUser(new User({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putUser', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'put');

      service.putUser(new User({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('putUsers', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'putAll');

      service.putUsers([new User({})]);

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.putAll).toHaveBeenCalled();
    });
  });

  describe('deleteUser', () => {
    it('should delete a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'delete');

      service.deleteUser('id');

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
