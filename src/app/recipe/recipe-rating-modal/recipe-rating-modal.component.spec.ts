import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeRatingModalComponent } from './recipe-rating-modal.component';
import { ModalComponent } from '@modalComponent';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Recipe } from '@recipe';
import { RecipeService } from '@recipeService';

describe('RecipeRatingModalComponent', () => {
  let component: RecipeRatingModalComponent;
  let fixture: ComponentFixture<RecipeRatingModalComponent>;
  let recipeService: RecipeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RecipeRatingModalComponent,
        ModalComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeRatingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    recipeService = TestBed.inject(RecipeService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onRate', () => {
    it('should rate a recipe', () => {
      component.Params = {
        function: () => {},
        recipe: new Recipe({}),
        uid: 'uid',
        timesCooked: 0,
        text: ''
      };
      fixture.detectChanges();

      spyOn(recipeService, 'rateRecipe');
      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.onRate(3, new Recipe({}));

      expect(recipeService.rateRecipe).toHaveBeenCalled();
      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should remove ingredients', () => {
      component.Params = {
        function: () => {},
        recipe: new Recipe({}),
        uid: 'uid',
        timesCooked: 0,
        text: ''
      };
      fixture.detectChanges();

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.confirm();

      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      component.Params = {
        function: () => {},
        recipe: new Recipe({}),
        uid: 'uid',
        timesCooked: 0,
        text: ''
      };
      fixture.detectChanges();

      spyOn(component.modal, 'close');

      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
