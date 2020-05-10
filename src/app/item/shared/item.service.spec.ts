import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { FirestoreService } from '@firestoreService';

import { ItemService } from './item.service';

describe('ItemService', () => {
  let service: ItemService;
  let firestoreService: FirestoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(ItemService);
    firestoreService = TestBed.inject(FirestoreService);
  });

  it('should be created', () => {
    const service: ItemService = TestBed.get(ItemService);
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should get all items', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of([{}]));

      service.getItems().subscribe(docs => {
        expect(docs).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('getItem', () => {
    it('should get one document based on an id', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'get').and.returnValue(of({}));

      service.getItem('id').then(doc => {
        expect(doc).toBeDefined();
      });

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.get).toHaveBeenCalled();
    });
  });

  describe('postItem', () => {
    it('should create a new document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'post');

      service.postItem({});

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.post).toHaveBeenCalled();
    });
  });

  describe('putItem', () => {
    it('should update a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'put');

      service.putItem('id', {});

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.put).toHaveBeenCalled();
    });
  });

  describe('deleteItem', () => {
    it('should delete a document', () => {
      spyOn(service, 'getRef');
      spyOn(firestoreService, 'delete');

      service.deleteItem('id');

      expect(service.getRef).toHaveBeenCalled();
      expect(firestoreService.delete).toHaveBeenCalled();
    });
  });
});
