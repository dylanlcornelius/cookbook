import { Component, Input } from '@angular/core';

export interface ModalComponentParams {
  callback?: (success: boolean) => void;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent<ModalParams extends ModalComponentParams> {
  @Input()
  params?: boolean | ModalParams;

  constructor() {}

  open(): void {
    this.params = true;
  }

  close(success = false): void {
    if (typeof this.params !== 'boolean') {
      this.params?.callback?.(success);
    }
    this.params = undefined;
  }
}
