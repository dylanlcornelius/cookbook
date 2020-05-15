import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationModalComponent } from './validation-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ValidationModalComponent', () => {
  let component: ValidationModalComponent;
  let fixture: ComponentFixture<ValidationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidationModalComponent ],
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
      component.validationModalParams = {
        function: () => {},
        self: component,
        text: 'text'
      }
      
      component.cancel();

      expect(component.validationModalParams).toBeUndefined();
    });
  });

  describe('confirm', () => {
    it('should execute a function and close the modal', () => {
      component.validationModalParams = {
        function: () => {},
        id: 'id',
        self: component,
        text: 'text'
      };

      component.confirm();

      expect(component.validationModalParams).toBeUndefined();
    });

    it('should execute a function and close the modal', () => {
      component.validationModalParams = {
        function: () => {},
        self: component,
        text: 'text'
      };

      component.confirm();

      expect(component.validationModalParams).toBeUndefined();
    });
  });
});
