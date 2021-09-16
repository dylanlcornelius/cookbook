import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValidationModalComponent } from './validation-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { Validation } from '@validation';

describe('ValidationModalComponent', () => {
  let component: ValidationModalComponent;
  let fixture: ComponentFixture<ValidationModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ValidationModalComponent,
        ModalComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      component.params = new Validation('text', () => {});

      spyOn(component.modal, 'close');
      
      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should execute a function and close the modal', () => {
      component.params = new Validation('text', () => {}, ['id']);

      spyOn(component.modal, 'close');

      component.confirm();

      expect(component.modal.close).toHaveBeenCalled();
    });

    it('should execute a function and close the modal', () => {
      component.params = new Validation('text', () => {});

      spyOn(component.modal, 'close');

      component.confirm();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
