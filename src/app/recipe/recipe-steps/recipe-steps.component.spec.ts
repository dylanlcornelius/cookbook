import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeStepsComponent } from './recipe-steps.component';
import { Recipe } from '@recipe';

describe('RecipeStepsComponent', () => {
  let component: RecipeStepsComponent;
  let fixture: ComponentFixture<RecipeStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeStepsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggleStep', () => {
    it('should toggle the selection for a recipe step', () => {
      const recipe = new Recipe({ steps: [{ step: 'Step 1' }] });

      component.toggleStep(recipe.steps[0]);

      expect(recipe.steps[0].isSelected).toBeTrue();
    });
  });

  describe('toggleDirections', () => {
    it('should toggle the expansion for a recipe step', () => {
      const recipe = new Recipe({ steps: [{ step: 'Step 1' }] });

      component.toggleDirections(recipe.steps[0]);

      expect(recipe.steps[0].isExpanded).toBeTrue();
    });
  });
});
