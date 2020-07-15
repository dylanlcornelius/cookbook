import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { Ingredient } from '../shared/ingredient.model';

import { IngredientDetailComponent } from './ingredient-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IngredientListComponent } from '../ingredient-list/ingredient-list.component';

describe('IngredientsDetailComponent', () => {
  let component: IngredientDetailComponent;
  let fixture: ComponentFixture<IngredientDetailComponent>;
  let ingredientService: IngredientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'ingredient/list', component: IngredientListComponent}
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
    ingredientService = TestBed.inject(IngredientService);
  }));

  it('should create', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.params = {id: 'testId'};

    spyOn(ingredientService, 'getIngredient').and.returnValue(of(new Ingredient({})));
    
    fixture = TestBed.createComponent(IngredientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(ingredientService.getIngredient).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  describe('deleteIngredient', () => {
    it('should open a validation modal to delete an ingredient', () => {
      fixture = TestBed.createComponent(IngredientDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ingredient = {name: 'name'};

      component.deleteIngredient('id');

      expect(component.validationModalParams).toBeDefined();
    });
  });

  describe('deleteIngredientEvent', () => {
    it('should delete an ingredient', () => {
      fixture = TestBed.createComponent(IngredientDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      const router = TestBed.inject(Router);
      spyOn(router, 'navigate');
      
      spyOn(ingredientService, 'deleteIngredient');

      component.deleteIngredientEvent(component, 'id');

      expect(ingredientService.deleteIngredient).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not try to delete an ingredient without an id', () => {
      fixture = TestBed.createComponent(IngredientDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      spyOn(ingredientService, 'deleteIngredient');

      component.deleteIngredientEvent(component, undefined);

      expect(ingredientService.deleteIngredient).not.toHaveBeenCalled();
    });
  });
});
