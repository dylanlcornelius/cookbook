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

  describe('get', () => {
    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get('id').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should handle a user id that does not match any documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([]));

      service.get('id').subscribe(doc => {
        expect(doc).toBeUndefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'create');

      service.create(new User({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'update');

      service.update(new User({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.update).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'updateAll');

      service.update([new User({})]);

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'delete');

      service.delete('id');

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
