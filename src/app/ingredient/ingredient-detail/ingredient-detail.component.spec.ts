import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { Ingredient } from '@ingredient';

import { IngredientDetailComponent } from './ingredient-detail.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { IngredientListComponent } from '../ingredient-list/ingredient-list.component';
import { NumberService } from 'src/app/util/number.service';

describe('IngredientsDetailComponent', () => {
  let component: IngredientDetailComponent;
  let fixture: ComponentFixture<IngredientDetailComponent>;
  let ingredientService: IngredientService;
  let numberService: NumberService;

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
    ingredientService = TestBed.inject(IngredientService);
    numberService = TestBed.inject(NumberService);
  }));

  it('should create', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.params = {id: 'testId'};

    spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));
    spyOn(numberService, 'toFormattedFraction').and.returnValue('1/2');
    
    fixture = TestBed.createComponent(IngredientDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(ingredientService.get).toHaveBeenCalled();
    expect(numberService.toFormattedFraction).toHaveBeenCalled();
    expect(component).toBeTruthy();
  });

  describe('deleteIngredient', () => {
    it('should open a validation modal to delete an ingredient', () => {
      fixture = TestBed.createComponent(IngredientDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      component.ingredient = new Ingredient({ name: 'name' });

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
      
      spyOn(ingredientService, 'delete');

      component.deleteIngredientEvent(component, 'id');

      expect(ingredientService.delete).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should not try to delete an ingredient without an id', () => {
      fixture = TestBed.createComponent(IngredientDetailComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      
      spyOn(ingredientService, 'delete');

      component.deleteIngredientEvent(component, undefined);

      expect(ingredientService.delete).not.toHaveBeenCalled();
    });
  });
});
