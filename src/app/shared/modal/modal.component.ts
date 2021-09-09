import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {
  @Input()
  params;

  constructor() { }

  open(): void {
    this.params = true;
  }

  close(): void {
    this.params = undefined;
  }
}
