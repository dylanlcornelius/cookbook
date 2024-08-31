import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Ingredient } from '@ingredient';
import { ModalComponent } from '@modalComponent';
import { RecipeIngredientModalService } from '@modalService';
import { Recipe } from '@recipe';
import { RecipeIngredient } from '@recipeIngredient';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { RecipeMultiplierService } from '@recipeMultiplierService';
import { UserIngredient } from '@userIngredient';
import { OptionalIngredientsPipe } from '../optional-ingredients.pipe';
import { RecipeIngredientModalComponent } from './recipe-ingredient-modal.component';

describe('RecipeIngredientModalComponent', () => {
  let component: RecipeIngredientModalComponent;
  let fixture: ComponentFixture<RecipeIngredientModalComponent>;
  let recipeIngredientModalService: RecipeIngredientModalService;
  let recipeMultiplierService: RecipeMultiplierService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RecipeIngredientModalComponent, ModalComponent, OptionalIngredientsPipe],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeIngredientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    recipeIngredientModalService = TestBed.inject(RecipeIngredientModalService);
    recipeMultiplierService = TestBed.inject(RecipeMultiplierService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('select', () => {
    it('should add when selected', () => {
      component.selectionCount = 0;

      component.select(true);

      expect(component.selectionCount).toEqual(1);
    });

    it('should subtract when unselected', () => {
      component.selectionCount = 1;

      component.select(false);

      expect(component.selectionCount).toEqual(0);
    });
  });

  describe('add', () => {
    const userIngredients = [new UserIngredient({})];
    const uid = 'uid';
    const householdId = 'default';

    beforeEach(() => {
      const recipeIngredientModal = new RecipeIngredientModal(
        () => {},
        new Recipe({}),
        [],
        [new RecipeIngredient({})],
        [new Ingredient({})],
        userIngredients,
        uid,
        householdId
      );
      recipeIngredientModalService.setModal(recipeIngredientModal);

      spyOn(recipeIngredientModalService, 'getModal');
    });

    it('should use all ingredients', () => {
      component.params.recipeIngredients = [new RecipeIngredient({ quantity: '1' })];

      spyOn(recipeMultiplierService, 'getQuantity').and.returnValue('1');
      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.add();

      expect(recipeMultiplierService.getQuantity).toHaveBeenCalled();
      expect(component.params.function).toHaveBeenCalledWith(
        component.params.recipeIngredients,
        component.params.userIngredients,
        component.params.ingredients,
        component.params.uid,
        component.params.householdId,
        component.params.recipe,
        component.params.recipes
      );
      expect(component.modal.close).toHaveBeenCalled();
    });

    it('should use only selected ingredients', () => {
      const recipeIngredient1 = new RecipeIngredient({ selected: true, quantity: '1' });
      const recipeIngredient2 = new RecipeIngredient({});

      component.params.recipeIngredients = [recipeIngredient1, recipeIngredient2];

      spyOn(recipeMultiplierService, 'getQuantity').and.returnValue('1');
      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.add();

      expect(recipeMultiplierService.getQuantity).toHaveBeenCalled();
      expect(component.params.function).toHaveBeenCalledWith(
        [recipeIngredient1],
        component.params.userIngredients,
        component.params.ingredients,
        component.params.uid,
        component.params.householdId,
        component.params.recipe,
        component.params.recipes
      );
      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      spyOn(component.modal, 'close');

      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
