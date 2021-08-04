import { Component, ViewChild } from '@angular/core';
import { ValidationService } from '@modalService';
import { Validation } from '@validation';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-validation-modal',
  templateUrl: './validation-modal.component.html',
  styleUrls: ['./validation-modal.component.scss']
})
export class ValidationModalComponent {
  private unsubscribe$ = new Subject();
  params: Validation;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(
    private validationService: ValidationService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  
  load() {
    this.validationService.getModal().pipe(takeUntil(this.unsubscribe$)).subscribe((validation: Validation) => {
      this.params = validation;
    });
  }

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
