import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroupDirective, FormBuilder, Validators } from '@angular/forms';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientService } from '@ingredientService';

import { IngredientEditComponent } from './ingredient-edit.component';
import { Ingredient } from '@ingredient';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IngredientDetailComponent } from '../ingredient-detail/ingredient-detail.component';
import { of } from 'rxjs';
import { TutorialService } from '@tutorialService';
import { ConfigService } from '@configService';
import { Config } from '@config';

describe('IngredientEditComponent', () => {
  let component: IngredientEditComponent;
  let fixture: ComponentFixture<IngredientEditComponent>;
  let ingredientService: IngredientService;
  let tutorialService: TutorialService;
  let configService: ConfigService;

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
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    ingredientService = TestBed.inject(IngredientService);
    tutorialService = TestBed.inject(TutorialService);
    configService = TestBed.inject(ConfigService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should get an ingredient', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({ 'ingredient-id': 'id' });

      spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));
      spyOn(configService, 'get').and.returnValue(of([new Config({})]));
  
      fixture = TestBed.createComponent(IngredientEditComponent);
      fixture.detectChanges();
  
      expect(ingredientService.get).toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });

    it('should not get an ingredient', () => {
      const route = TestBed.inject(ActivatedRoute);
      route.params = of({});

      spyOn(ingredientService, 'get').and.returnValue(of(new Ingredient({})));
      spyOn(configService, 'get').and.returnValue(of([new Config({})]));
  
      fixture = TestBed.createComponent(IngredientEditComponent);
      fixture.detectChanges();
  
      expect(ingredientService.get).not.toHaveBeenCalled();
      expect(configService.get).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    const formDirective = new FormGroupDirective([], []);

    beforeEach(() => {
      spyOn(formDirective, 'resetForm');
    });

    it('should do nothing for an invalid form', () => {
      const router = TestBed.inject(Router);
      component.id = 'id';
      component.ingredient = new Ingredient({});
      component.ingredientsForm = new FormBuilder().group({ name: [null, Validators.required] });

      spyOn(ingredientService, 'update');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onSubmit(formDirective);

      expect(ingredientService.update).not.toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(formDirective.resetForm).not.toHaveBeenCalled();
    });

    it('should update an ingredient', () => {
      const router = TestBed.inject(Router);
      component.id = 'id';
      component.ingredient = new Ingredient({});
      component.ingredientsForm = new FormBuilder().group({});

      spyOn(ingredientService, 'update');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onSubmit(formDirective);

      expect(ingredientService.update).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
      expect(formDirective.resetForm).toHaveBeenCalled();
    });

    it('should create an ingredient', () => {
      const router = TestBed.inject(Router);
      component.ingredientsForm = new FormBuilder().group({});

      spyOn(ingredientService, 'create').and.returnValue('id');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onSubmit(formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).not.toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalled();
      expect(formDirective.resetForm).toHaveBeenCalled();
    });

    it('should create an ingredient from the quick view', () => {
      const router = TestBed.inject(Router);
      component.isQuickView = true;
      component.ingredientsForm = new FormBuilder().group({});

      spyOn(ingredientService, 'create').and.returnValue('id');
      spyOn(component.handleIngredientCreate, 'emit');
      spyOn(router, 'navigate');

      component.onSubmit(formDirective);

      expect(ingredientService.create).toHaveBeenCalled();
      expect(component.handleIngredientCreate.emit).toHaveBeenCalled();
      expect(router.navigate).not.toHaveBeenCalled();
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
