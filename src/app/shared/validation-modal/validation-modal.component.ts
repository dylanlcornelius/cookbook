import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ValidationService } from '@modalService';
import { Validation } from '@validation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from '@modalComponent';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss'],
})
export class ValidationModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  params: Validation;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(private validationService: ValidationService) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.validationService
      .getModal()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((validation: Validation) => {
        this.params = validation;
      });
  }

  cancel(): void {
    this.modal.close();
  }

  confirm(): void {
    this.params.function(...this.params.args);
    this.modal.close();
  }
}
