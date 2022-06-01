import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';

import { IngredientDetailComponent } from './ingredient-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IngredientListComponent } from '../ingredient-list/ingredient-list.component';
import { ValidationService } from '@modalService';
import { TutorialService } from '@tutorialService';
import { NumberService } from '@numberService';

describe('IngredientsDetailComponent', () => {
  let component: IngredientDetailComponent;
  let fixture: ComponentFixture<IngredientDetailComponent>;
  let ingredientService: IngredientService;
  let numberService: NumberService;
  let validationService: ValidationService;
  let tutorialService: TutorialService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'ingredient/list', component: IngredientListComponent }
        ])
      ],
      providers: [
        IngredientService
      ],
      declarations: [ IngredientDetailComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientDetailComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    ingredientService = TestBed.inject(IngredientService);
    numberService = TestBed.inject(NumberService);
    validationService = TestBed.inject(ValidationService);
    tutorialService = TestBed.inject(TutorialService);
  });

  describe('load', () => {
    it('should create', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ id: 'id' });
  
      spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));
      spyOn(numberService, 'toFormattedFraction').and.returnValue('1/2');
      
      component.load();
  
      expect(ingredientService.get).toHaveBeenCalled();
      expect(numberService.toFormattedFraction).toHaveBeenCalled();
      expect(component).toBeTruthy();
    });
  });

  describe('deleteIngredient', () => {
    it('should open a validation modal to delete an ingredient', () => {
      component.ingredient = new Ingredient({ name: 'name' });

      spyOn(validationService, 'setModal');

      component.deleteIngredient('id');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('deleteIngredientEvent', () => {
    it('should delete an ingredient', () => {
      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      
      spyOn(ingredientService, 'delete');

      component.deleteIngredientEvent('id');

      expect(ingredientService.delete).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not try to delete an ingredient without an id', () => {
      spyOn(ingredientService, 'delete');

      component.deleteIngredientEvent(undefined);

      expect(ingredientService.delete).not.toHaveBeenCalled();
    });
  });

  describe('openTutorial', () => {
    it('should open the tutorial', () => {
      spyOn(tutorialService, 'openTutorial');

      component.openTutorial();

      expect(tutorialService.openTutorial).toHaveBeenCalled();
    });
  });
});
