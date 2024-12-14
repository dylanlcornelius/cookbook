import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FirebaseService } from '@firebaseService';
import { FirestoreService } from '@firestoreService';
import { Recipe } from '@recipe';
import { of } from 'rxjs';
import { MealPlan } from './meal-plan.model';

import { MealPlanService } from './meal-plan.service';

describe('MealPlanService', () => {
  let service: MealPlanService;
  let firebase: FirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
    });
    service = TestBed.inject(MealPlanService);
    firebase = TestBed.inject(FirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(MealPlan);
    });
  });

  describe('getByUser', () => {
    it('should return an existing user item record', () => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([{}]));
      spyOn(service, 'create');

      service.getByUser('uid').subscribe((doc) => {
        expect(doc).toBeDefined();
      });
      -expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
      expect(service.create).not.toHaveBeenCalled();
    });

    it('should create a user item record and return it', fakeAsync(() => {
      spyOn(firebase, 'where');
      spyOn(firebase, 'query');
      spyOn(FirestoreService.prototype, 'getByQuery').and.returnValue(of([]));
      spyOn(service, 'create');

      service.getByUser('uid').subscribe((doc) => {
        expect(doc).toBeDefined();
      });

      tick();
      expect(firebase.where).toHaveBeenCalled();
      expect(firebase.query).toHaveBeenCalled();
      expect(FirestoreService.prototype.getByQuery).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalled();
    }));
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
