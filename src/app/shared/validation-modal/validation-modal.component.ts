/*
** DROP THIS IN HTML **
<app-validation-modal [params]="validationModalParams"></app-validation-modal>

** DROP THIS IN TYPESCRIPT **
-- id is optional --
validationModalParams;

this.validationModalParams = {
  function: this.removeConfigEvent,
  id: id,
  self: this,
  text: 'Are you sure you want to delete config ' + name + '?'
};
*/

import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss']
})
export class ValidationModalComponent {
  @Input()
  params;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor() {}

  cancel() {
    this.modal.close();
  }

  confirm() {
    if (this.params.id) {
      this.params.function(this.params.self, this.params.id);
    } else {
      this.params.function(this.params.self);
    }
    this.modal.close();
  }
}
