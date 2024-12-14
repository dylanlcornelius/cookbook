import { TestBed } from '@angular/core/testing';
import { Config } from '@config';
import { ConfigService } from '@configService';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { of } from 'rxjs/internal/observable/of';

describe('ConfigService', () => {
  let service: ConfigService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    const service: ConfigService = TestBed.inject(ConfigService);
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(Config);
    });
  });

  describe('getByName', () => {
    it('should get documents based on a name', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));

      service.getByName('name').subscribe((docs) => {
        expect(docs).toBeDefined();
      });

      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
    });
  });

  describe('getAll', () => {
    it('should get all documents', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getAll').and.returnValue(of([{}]));

      service.getAll().subscribe((docs) => {
        expect(docs).toBeDefined();
      });

      expect(firebase.where).not.toHaveBeenCalled();
      expect(firebase.query).not.toHaveBeenCalled();
      expect(FirestoreService.prototype.getAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Config({}).getObject());

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update all documents', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Config({})]);

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

  describe('sortByOrder', () => {
    it('should sort two configs by order', () => {
      const result = service.sortByOrder(new Config({ order: 2 }), new Config({ order: 1 }));

      expect(result).toEqual(1);
    });
  });

  describe('sortByName', () => {
    it('should sort two configs by name', () => {
      const result = service.sortByName(
        new Config({ name: 'RECIPE_TYPE' }),
        new Config({ name: 'INGREDIENT_CATEGORY' })
      );

      expect(result).toEqual(1);
    });
  });
});
