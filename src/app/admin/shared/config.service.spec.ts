import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs/internal/observable/of';
import { Config } from './config.model';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.inject(ConfigService);
    expect(service).toBeTruthy();
  });

  describe('getConfigs', () => {
    it('should get one document based on an id', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get('name').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Config({}));

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'update');

      service.update(new Config({}));

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.update).toHaveBeenCalled();
    });

    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Config({})]);

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a document', () => {
      spyOn(FirestoreService.prototype, 'getRef');
      spyOn(FirestoreService.prototype, 'delete');

      service.delete('id');

      expect(FirestoreService.prototype.getRef).toHaveBeenCalled();
      expect(FirestoreService.prototype.delete).toHaveBeenCalled();
    });
  });
});
