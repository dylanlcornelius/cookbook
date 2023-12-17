import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { RecipeEditComponent } from '../recipe/recipe-edit/recipe-edit.component';

@Directive({
  selector: '[appFormValidation]',
})
export class FormValidationDirective {
  @Input()
  stepperOnSubmit: RecipeEditComponent['stepperOnSubmit'];

  constructor(private el: ElementRef, private formGroupDirective: FormGroupDirective) {}

  @HostListener('ngSubmit') onSubmit(): void {
    if (this.formGroupDirective.control.invalid) {
      this.scrollToInvalidControl();
    }
  }

  scrollToInvalidControl(): void {
    const form = this.formGroupDirective.form;

    for (let key of Object.keys(form.controls)) {
      if (form.controls[key].invalid) {
        key = this.stepperOnSubmit ? this.stepperOnSubmit(key) : key;

        setTimeout(() => {
          const invalidControl = this.el.nativeElement.querySelector(
            `[formcontrolname="${key}"].ng-invalid`
          );
          invalidControl?.focus({ preventScroll: true });
          invalidControl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
        break;
      }
    }
    form.markAllAsTouched();
    return;
  }
}
