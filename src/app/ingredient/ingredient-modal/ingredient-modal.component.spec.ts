import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IngredientModalComponent } from './ingredient-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalComponent } from '@modalComponent';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NumberService } from '@numberService';

describe('IngredientModalComponent', () => {
  let component: IngredientModalComponent;
  let fixture: ComponentFixture<IngredientModalComponent>;
  let numberService: NumberService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        IngredientModalComponent,
        ModalComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    numberService = TestBed.inject(NumberService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      component.Params = undefined;

      spyOn(component.modal, 'close');

      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should do nothing for an invalid form', () => {
      spyOn(numberService, 'toFormattedFraction');

      component.Params = {
        function: () => {},
        data: {
          ingredientId: 'id'
        },
        userIngredients: [{ingredientId: 'id'}],
        dataSource: {
          data: [{id: 'id', pantryQuatity: 10}]
        },
        text: ''
      };
      component.form = new FormBuilder().group({ name: [null, Validators.required] });

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.onSubmit();

      expect(numberService.toFormattedFraction).toHaveBeenCalled();
      expect(component.params.function).not.toHaveBeenCalled();
      expect(component.modal.close).not.toHaveBeenCalled();
    });

    it('should change an ingredient pantry quantity', () => {
      spyOn(numberService, 'toFormattedFraction');

      component.Params = {
        function: () => {},
        data: {
          ingredientId: 'id'
        },
        userIngredients: [{ingredientId: 'id'}],
        dataSource: {
          data: [{id: 'id', pantryQuatity: 10}]
        },
        text: ''
      };
      component.form = new FormBuilder().group({ pantryQuantity: [null] });

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.onSubmit();

      expect(numberService.toFormattedFraction).toHaveBeenCalled();
      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
