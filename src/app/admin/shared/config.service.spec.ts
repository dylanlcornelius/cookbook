import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs/internal/observable/of';
import { Config } from './config.model';

import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;
  let firestoreService: FirestoreService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.inject(ConfigService);
    expect(service).toBeTruthy();
  });

  describe('getConfigs', () => {
    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get('name').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });

    it('should get all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.get().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'create');

      service.create(new Config({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'update');

      service.update(new Config({}));

      expect(firestoreService.getRef).toHaveBeenCalled();
      expect(firestoreService.update).toHaveBeenCalled();
    });

    it('should update all documents', () => {
      spyOn(firestoreService, 'getRef');
      spyOn(firestoreService, 'updateAll');

      service.update([new Config({})]);

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
