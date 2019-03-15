import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.css']
})
export class ValidationModalComponent implements OnInit {

  @Input()
  modalText: string;

  @Input()
  modalKey: string;

  @Output()
  closeEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.closeEvent.next(this.modalKey);
  }

  confirm() {
    this.closeEvent.next(this.modalKey);
  }

}
