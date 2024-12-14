import { TestBed } from '@angular/core/testing';
import { Feedback } from '@feedback';
import { FirestoreService } from '@firestoreService';
import { FeedbackService } from './feedback.service';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(Feedback);
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Feedback({}).getObject());

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Feedback({})]);

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
