import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroupDirective, FormBuilder } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientService } from '@ingredientService';

import { IngredientEditComponent } from './ingredient-edit.component';
import { Ingredient } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IngredientDetailComponent } from '../ingredient-detail/ingredient-detail.component';
import { of } from 'rxjs';
import { TutorialService } from '@tutorialService';

describe('IngredientEditComponent', () => {
  let component: IngredientEditComponent;
  let fixture: ComponentFixture<IngredientEditComponent>;
  let ingredientService: IngredientService;
  let formBuilder: FormBuilder;
  let tutorialService: TutorialService;

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
    formBuilder = TestBed.inject(FormBuilder);
    tutorialService = TestBed.inject(TutorialService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should get an ingredient', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ 'ingredient-id': 'id' });

      spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));
  
      fixture = TestBed.createComponent(IngredientEditComponent);
      fixture.detectChanges();
  
      expect(ingredientService.get).toHaveBeenCalled();
    });
  });

  describe('onFormSubmit', () => {
    const formDirective = new FormGroupDirective([], []);

    beforeEach(() => {
      spyOn(formDirective, 'resetForm');
    });

    it('should update an ingredient', () => {
      component.id = 'id';
      const router = TestBed.inject(Router);

      spyOn(ingredientService, 'update');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(formBuilder.group({}), formDirective);

      expect(ingredientService.update).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create an ingredient', () => {
      const router = TestBed.inject(Router);

      spyOn(ingredientService, 'create').and.returnValue('id');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(formBuilder.group({}), formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
    });

    it('should create an ingredient from the quick view', () => {
      const router = TestBed.inject(Router);
      component.isQuickView = true;

      spyOn(ingredientService, 'create').and.returnValue('id');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onFormSubmit(formBuilder.group({}), formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
    });

    afterEach(() => {
      expect(formDirective.resetForm).toHaveBeenCalled();
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
