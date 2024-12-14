import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { CurrentUserService } from '@currentUserService';
import { Feedback } from '@feedback';
import { FeedbackService } from '@feedbackService';
import { LoadingService } from '@loadingService';
import { ModalComponent, ModalComponentParams } from '@modalComponent';
import { NotificationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { User } from '@user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {
  private unsubscribe$ = new Subject();
  loading = true;

  form: FormGroup;
  user: User;

  @ViewChild(ModalComponent)
  modal: ModalComponent<ModalComponentParams>;

  constructor(
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private feedbackService: FeedbackService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.loading = this.loadingService.set(true);
    const user$ = this.currentUserService.getCurrentUser();

    user$.pipe(takeUntil(this.unsubscribe$)).subscribe((user) => {
      this.form = new FormBuilder().group({
        description: [null, Validators.required],
      });

      this.user = user;
      this.loading = this.loadingService.set(false);
    });
  }

  open(): void {
    this.modal.open();
  }

  close(): void {
    this.modal.close();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.form.invalid) {
      return;
    }

    const form = this.form.value;
    form.author = this.user.name;
    form.uid = this.user.uid;

    this.feedbackService.create(new Feedback(form));
    this.notificationService.setModal(new SuccessNotification('Feedback submitted!'));
    formDirective.resetForm();
    this.form.reset();
    this.modal.close();
  }
}
