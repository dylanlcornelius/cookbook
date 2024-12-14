import { TestBed } from '@angular/core/testing';
import { FirestoreService } from '@firestoreService';
import { NotificationService, ValidationService } from '@modalService';
import { Recipe, RECIPE_STATUS } from '@recipe';
import { RecipeService } from '@recipeService';

describe('RecipeService', () => {
  let service: RecipeService;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipeService);
    validationService = TestBed.inject(ValidationService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getForm', () => {
    it('should return the editor form', () => {
      service.getForm().subscribe((form) => {
        expect(form).toBeDefined();
      });
    });
  });

  describe('setForm', () => {
    it('should set the editor form', () => {
      spyOn(service.editorForm, 'next');

      service.setForm(null);

      expect(service.editorForm.next).toHaveBeenCalled();
    });
  });

  describe('factory', () => {
    it('should construct a model', () => {
      const result = service.factory({});

      expect(result).toBeInstanceOf(Recipe);
    });
  });

  describe('create', () => {
    it('should create a new document', () => {
      spyOn(FirestoreService.prototype, 'create');

      service.create(new Recipe({}).getObject());

      expect(FirestoreService.prototype.create).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateOne');

      service.update(new Recipe({}).getObject(), 'id');

      expect(FirestoreService.prototype.updateOne).toHaveBeenCalled();
    });

    it('should update a document', () => {
      spyOn(FirestoreService.prototype, 'updateAll');

      service.update([new Recipe({})]);

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

  describe('calculateMeanRating', () => {
    it('should do nothing when ratings is not defined', () => {
      const result = service.calculateMeanRating(undefined);

      expect(result).toEqual(0);
    });

    it('should set the average to zero when there are no ratings', () => {
      const result = service.calculateMeanRating([]);

      expect(result).toEqual(0);
    });

    it('should return the average of ratings', () => {
      const ratings = [
        {
          rating: 1,
          uid: 'uid1',
        },
        {
          rating: 2,
          uid: 'uid2',
        },
      ];

      const result = service.calculateMeanRating(ratings);

      expect(result).toEqual(50);
    });
  });

  describe('rateRecipe', () => {
    it('should update a recipe with a rating', () => {
      spyOn(service, 'calculateMeanRating');
      spyOn(service, 'update');

      service.rateRecipe(1, 'uid', new Recipe({ ratings: [{ uid: 'uid2' }] }));

      expect(service.calculateMeanRating).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });

    it('should update a recipe without a rating', () => {
      spyOn(service, 'calculateMeanRating');
      spyOn(service, 'update');

      service.rateRecipe(0, 'uid', new Recipe({}));

      expect(service.calculateMeanRating).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalled();
    });
  });

  describe('changeStatus', () => {
    it('should open a validation model', () => {
      spyOn(validationService, 'setModal');

      service.changeStatus(new Recipe({}));

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('changeStatusEvent', () => {
    it('should set a recipe status to published', () => {
      spyOn(service, 'update');
      spyOn(notificationService, 'setModal');

      service.changeStatusEvent(new Recipe({}));

      expect(service.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });

    it('should set a recipe status to private', () => {
      spyOn(service, 'update');
      spyOn(notificationService, 'setModal');

      service.changeStatusEvent(new Recipe({ status: RECIPE_STATUS.PUBLISHED }));

      expect(service.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
