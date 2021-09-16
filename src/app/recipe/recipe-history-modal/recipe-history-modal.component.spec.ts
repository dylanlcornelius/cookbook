import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RecipeHistoryModalComponent } from './recipe-history-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { MatInputModule } from '@angular/material/input';
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

  describe('confirm', () => {
    it('should change an ingredient pantry quantity', () => {
      component.Params = {
        function: () => {},
        recipeId: 'id',
        uid: 'uid',
        householdId: 'householdId',
        timesCooked: 0,
        text: ''
      };

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.confirm();

      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
