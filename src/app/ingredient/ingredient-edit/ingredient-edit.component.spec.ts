import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NgForm, FormGroupDirective } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientService } from '@ingredientService';

import { IngredientEditComponent } from './ingredient-edit.component';
import { Ingredient } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IngredientDetailComponent } from '../ingredient-detail/ingredient-detail.component';
import { of } from 'rxjs';

describe('IngredientEditComponent', () => {
  let component: IngredientEditComponent;
  let fixture: ComponentFixture<IngredientEditComponent>;
  let ingredientService: IngredientService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'ingredient/detail/:id', component: IngredientDetailComponent }
        ]),
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [ IngredientEditComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    ingredientService = TestBed.inject(IngredientService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get an ingredient', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.snapshot.params = {'ingredient-id': 'testId'};

    spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));

    fixture = TestBed.createComponent(IngredientEditComponent);
    fixture.detectChanges();

    expect(ingredientService.get).toHaveBeenCalled();
  });

  describe('onFormSubmit', () => {
    const form = new NgForm([], []);
    const formDirective = new FormGroupDirective([], []);

    beforeEach(() => {
      spyOn(form, 'reset');
      spyOn(formDirective, 'resetForm');
    });

    it('should update an ingredient', () => {
      component.id = 'testId';
      const route = TestBed.inject(ActivatedRoute);
      route.snapshot.params = {'ingredient-id': 'testId'};
      const router = TestBed.inject(Router);

      spyOn(ingredientService, 'update');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(form, formDirective);

      expect(ingredientService.update).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create an ingredient', () => {
      const router = TestBed.inject(Router);

      spyOn(ingredientService, 'create').and.returnValue('testId');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(form, formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create an ingredient from the quick view', () => {
      const router = TestBed.inject(Router);
      component.isQuickView = true;

      spyOn(ingredientService, 'create').and.returnValue('testId');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(form, formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    afterEach(() => {
      expect(form.reset).toHaveBeenCalled();
      expect(formDirective.resetForm).toHaveBeenCalled();
    });
  });
});
