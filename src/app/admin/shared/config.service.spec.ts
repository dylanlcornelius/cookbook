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
    service = TestBed.get(ConfigService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.get(ConfigService);
    expect(service).toBeTruthy();
  });

  describe('getConfigs', () => {
    it('should get all documents', () => {
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getConfigs().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  xdescribe('getConfig', () => {
    it('should get one document based on an id', () => {
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.getConfig('id').then(doc => {
        expect(doc).toBeDefined();
      });

      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('postConfig', () => {
    it('should create a new document', () => {
      spyOn(firestoreService, 'post');

      service.postConfig(new Config({}));

      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putConfig', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'put');

      service.putConfig(new Config({}));

      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  xdescribe('putConfig', () => {
    it('should update a document', () => {
      spyOn(firestoreService, 'put');

      service.putConfigs([new Config({})]);

      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('deleteConfig', () => {
    it('should delete a document', () => {
      spyOn(firestoreService, 'delete');

      service.deleteConfig('id');

      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
