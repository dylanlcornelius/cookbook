import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackComponent } from './feedback.component';
import {
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { User } from '@user';
import { NotificationService } from '@modalService';
import { FeedbackService } from '@feedbackService';
import { ModalComponent } from '@modalComponent';

describe('FeedbackComponent', () => {
  let component: FeedbackComponent;
  let fixture: ComponentFixture<FeedbackComponent>;
  let feedbackService: FeedbackService;
  let notificationService: NotificationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ModalComponent, FeedbackComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    feedbackService = TestBed.inject(FeedbackService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should load the component and open the modal', () => {
      spyOn(component.modal, 'open');

      component.open();

      expect(component.modal.open).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should close the modal', () => {
      spyOn(component.modal, 'close');

      component.close();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('onSubmit', () => {
    it('should do nothing for an invalid form', () => {
      const formDirective = new FormGroupDirective([], []);

      component.form = new FormBuilder().group({ name: [null, Validators.required] });
      component.user = new User({});

      spyOn(feedbackService, 'create');
      spyOn(notificationService, 'setModal');
      spyOn(formDirective, 'resetForm');
      spyOn(component.modal, 'close');

      component.onSubmit(formDirective);

      expect(feedbackService.create).not.toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
      expect(formDirective.resetForm).not.toHaveBeenCalled();
      expect(component.modal.close).not.toHaveBeenCalled();
    });

    it('should update a user record', () => {
      const formDirective = new FormGroupDirective([], []);

      component.form = new FormBuilder().group({});
      component.user = new User({});

      spyOn(feedbackService, 'create');
      spyOn(notificationService, 'setModal');
      spyOn(formDirective, 'resetForm');
      spyOn(component.modal, 'close');

      component.onSubmit(formDirective);

      expect(feedbackService.create).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
      expect(formDirective.resetForm).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
