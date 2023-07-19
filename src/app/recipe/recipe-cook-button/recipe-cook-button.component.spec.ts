import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeCookButtonComponent } from './recipe-cook-button.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RecipeHistoryService } from '@recipeHistoryService';
import { RecipeHistory } from '@recipeHistory';
import { of } from 'rxjs';
import { Recipe } from '@recipe';

describe('RecipeCookButtonComponent', () => {
  let component: RecipeCookButtonComponent;
  let fixture: ComponentFixture<RecipeCookButtonComponent>;
  let recipeHistoryService: RecipeHistoryService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeCookButtonComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeCookButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('remove', () => {
    it('should remove ingredients', () => {
      component.recipe = new Recipe({ ratings: [{ uid: 'uid', rating: 3 }] });
      component.uid = 'uid';
      const recipeHistory = new RecipeHistory({ timesCooked: 2 });

      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistory));
      spyOn(component, 'removeEvent');

      component.remove();

      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(component.removeEvent).toHaveBeenCalled();
      expect(component.recipeRatingModalParams).toEqual(undefined);
    });

    it('should display the rating modal', () => {
      component.recipe = new Recipe({ ratings: [{ uid: 'test-uid', rating: 3 }] });
      component.uid = 'uid';
      const recipeHistory = new RecipeHistory({ timesCooked: 2 });

      spyOn(recipeHistoryService, 'get').and.returnValue(of(recipeHistory));
      spyOn(component, 'removeEvent');

      component.remove();

      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(component.removeEvent).not.toHaveBeenCalled();
      expect(component.recipeRatingModalParams).not.toEqual(undefined);
    });
  });

  describe('removeEvent', () => {
    it('should remove ingredients', () => {
      spyOn(component.removeIngredients, 'emit');

      component.removeEvent();

      expect(component.removeIngredients.emit).toHaveBeenCalled();
    });
  });
});
