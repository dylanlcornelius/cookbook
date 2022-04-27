import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FirestoreService } from '@firestoreService';
import { Recipe } from '@recipe';
import { of } from 'rxjs';
import { MealPlan } from './meal-plan.model';

import { MealPlanService } from './meal-plan.service';

describe('MealPlanService', () => {
  let service: MealPlanService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ]
    });
    service = TestBed.inject(MealPlanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('should return an existing user item record', () => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });
-
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should return an existing user item record with a ref', () => {
      (<any>service.ref) = { where: () => {} };
    
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([{}]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');
      spyOn(service.ref, 'where');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });
-
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
      expect(service.ref.where).toHaveBeenCalled();
    });

    it('should create a user item record and return it', fakeAsync(() => {
      spyOn(FirestoreService.prototype, 'getMany').and.returnValue(of([]));
      spyOn(FirestoreService.prototype, 'get');
      spyOn(service, 'create');

      service.get('uid').subscribe(doc => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(FirestoreService.prototype.getMany).toHaveBeenCalled();
      expect(FirestoreService.prototype.get).not.toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));

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
    it('should create a user item record', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new MealPlan({}));

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a user item record', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new MealPlan({}), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update user item records', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new MealPlan({})]);

      expect(FirestoreService.prototype.updateAll).toHaveBeenCalled();
    });
  });

  describe('formattedUpdate', () => {
    it('should update with formatted data', () => {
      spyOn(service, 'update');

      service.formattedUpdate([new Recipe({})], '', '');

      expect(service.update).toHaveBeenCalled();
    });
  });
});
