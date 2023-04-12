import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormValidationDirective } from './form-validation.directive';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-mock-form-compoent',
  template: '<form [formGroup]="form" #formDirective="ngForm" (ngSubmit)="onSubmit()" appFormValidation><button class="submit-button" type="submit"></button></form>'
})
class MockFormComponent {
  form = new FormBuilder().group({
    name: [null, Validators.required]
  });

  onSubmit() {}
}

@Component({
  selector: 'app-mock-form-stepper-compoent',
  template: '<form [formGroup]="form" #formDirective="ngForm" (ngSubmit)="onSubmit()" appFormValidation [stepperOnSubmit]="stepperOnSubmit"><button class="submit-button" type="submit"></button></form>'
})
class MockFormStepperComponent {
  form = new FormBuilder().group({
    name: [null, Validators.required]
  });

  stepperOnSubmit() {}
  onSubmit() {}
}

describe('FormValidationDirective', () => {
  let component: MockFormComponent;
  let fixture: ComponentFixture<MockFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [
        MockFormComponent,
        MockFormStepperComponent,
        FormValidationDirective,
      ]
    })
    .compileComponents();
  });

  it('should move to the first invalid control', waitForAsync(() => {
    fixture = TestBed.createComponent(MockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.form, 'markAllAsTouched');

    const button = fixture.debugElement.nativeElement.querySelector('.submit-button');
    button.click();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  }));

  it('should move to the first invalid control and use a stepper function', waitForAsync(() => {
    fixture = TestBed.createComponent(MockFormStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.form, 'markAllAsTouched');

    const button = fixture.debugElement.nativeElement.querySelector('.submit-button');
    button.click();

    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  }));
});
