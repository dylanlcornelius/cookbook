import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IngredientService } from '@ingredientService';

import { IngredientEditComponent } from './ingredient-edit.component';
import { Ingredient } from '../shared/ingredient.model';

describe('IngredientEditComponent', () => {
  let component: IngredientEditComponent;
  let fixture: ComponentFixture<IngredientEditComponent>;
  let ingredientService: IngredientService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      declarations: [ IngredientEditComponent ]
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
    const route = TestBed.get(ActivatedRoute);
    route.snapshot = {params: {id: 'testId'}};

    spyOn(ingredientService, 'getIngredient').and.returnValue(Promise.resolve(new Ingredient({})));

    fixture = TestBed.createComponent(IngredientEditComponent);
    fixture.detectChanges();

    expect(ingredientService.getIngredient).toHaveBeenCalled();
  });

  describe('onFormSubmit', () => {
    it('should update an ingredient', () => {
      component.id = 'testId';
      const route = TestBed.get(ActivatedRoute);
      route.snapshot = {params: {id: 'testId'}};

      spyOn(ingredientService, 'putIngredient');

      component.onFormSubmit(new NgForm([], []));

      expect(ingredientService.putIngredient).toHaveBeenCalled();
    });

    it('should create an ingredient', () => {
      spyOn(ingredientService, 'postIngredient').and.returnValue('testId');

      component.onFormSubmit(new NgForm([], []));

      expect(ingredientService.postIngredient).toHaveBeenCalled();
    });
  });
});
