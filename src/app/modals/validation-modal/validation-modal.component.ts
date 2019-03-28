/*
** DROP THIS IN HTML **
<app-validation-modal [validationModalParams]="validationModalParams"></app-validation-modal>

** DROP THIS IN TYPESCRIPT **
-- id is optional --
validationModalParams;

this.validationModalParams = {
  function: this.removeConfigEvent,
  id: key,
  self: this,
  text: 'Are you sure you want to delete config ' + name + '?'
};
*/

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css']
})
export class ValidationModalComponent {

  @Input()
  validationModalParams;

  constructor() { }

  cancel() {
    this.validationModalParams = undefined;
  }

  confirm() {
    if (this.validationModalParams.id) {
      this.validationModalParams.function(this.validationModalParams.self, this.validationModalParams.id);
    } else {
      this.validationModalParams.function(this.validationModalParams.self);
    }
    this.validationModalParams = undefined;
  }
}
