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

  close(success = false): void {
    this.params.callback?.(success);
    this.params = undefined;
  }
}
