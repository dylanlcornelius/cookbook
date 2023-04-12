import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { RecipeHistoryModalComponent } from './recipe-history-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalComponent } from '@modalComponent';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RecipeHistoryModalComponent', () => {
  let component: RecipeHistoryModalComponent;
  let fixture: ComponentFixture<RecipeHistoryModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      declarations: [
        RecipeHistoryModalComponent,
        ModalComponent,
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
      component.Params = {
        function: () => {},
        recipeId: 'id',
        uid: 'uid',
        householdId: 'householdId',
        timesCooked: 0,
        text: ''
      };
      component.form = new FormBuilder().group({ name: [null, Validators.required] });

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.onSubmit();

      expect(component.params.function).not.toHaveBeenCalled();
      expect(component.modal.close).not.toHaveBeenCalled();
    });

    it('should change an ingredient pantry quantity', () => {
      component.Params = {
        function: () => {},
        recipeId: 'id',
        uid: 'uid',
        householdId: 'householdId',
        timesCooked: 0,
        text: ''
      };
      component.form = new FormBuilder().group({ timesCooked: [null] });

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.onSubmit();

      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
