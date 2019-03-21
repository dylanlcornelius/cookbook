import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css']
})
export class ValidationModalComponent implements OnInit {

  // @Input()
  // modalText: string;

  @Input()
  validationModalParams;

  constructor() { }

  ngOnInit() {
  }

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
