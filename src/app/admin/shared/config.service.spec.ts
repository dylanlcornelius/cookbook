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
    it('should get all documents', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getConfigs().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('getConfig', () => {
    it('should get one document based on an id', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getConfig('name').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('postConfig', () => {
    it('should create a new document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'post');

      service.postConfig(new Config({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putConfig', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'put');

      service.putConfig(new Config({}));

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('putConfigs', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'putAll');

      service.putConfigs([new Config({})]);

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.putAll).toHaveBeenCalled();
    });
  });

  describe('deleteConfig', () => {
    it('should delete a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'delete');

      service.deleteConfig('id');

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
