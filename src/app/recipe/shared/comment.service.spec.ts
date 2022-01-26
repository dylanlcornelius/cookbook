import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs';
import { Comment } from '@comment';

import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should get many document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');

      service.get('id').subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
    });

    it('should get many document based on an id with a ref', () => {
      (<any>service.ref) = { where: () => {} };

      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service.ref, 'where');

      service.get('id').subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.ref.where).toHaveBeenCalled();
    });

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
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Comment({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new Comment({}).getObject(), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Comment({})]);

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
