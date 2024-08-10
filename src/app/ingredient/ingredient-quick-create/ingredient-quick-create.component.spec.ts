import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ModalComponent } from '@modalComponent';
import { IngredientEditComponent } from '../ingredient-edit/ingredient-edit.component';

import { IngredientQuickCreateComponent } from './ingredient-quick-create.component';

@Component({
  selector: 'app-ingredient-edit',
  template: '<p>Mock Ingredient Edit Component</p>',
})
class MockIngredientEditComponent {}

describe('IngredientQuickCreateComponent', () => {
  let component: IngredientQuickCreateComponent;
  let fixture: ComponentFixture<IngredientQuickCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([{ path: 'ingredient/edit', component: IngredientEditComponent }]),
        FormsModule,
        ReactiveFormsModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [IngredientQuickCreateComponent, ModalComponent, MockIngredientEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientQuickCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should load the component and open the modal', () => {
      component.edit = { load: () => {} } as unknown as IngredientEditComponent;

      spyOn(component.edit, 'load');
      spyOn(component.modal, 'open');

      component.open();

      expect(component.edit.load).toHaveBeenCalled();
      expect(component.modal.open).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the modal', () => {
      spyOn(component.modal, 'close');

      component.close();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
