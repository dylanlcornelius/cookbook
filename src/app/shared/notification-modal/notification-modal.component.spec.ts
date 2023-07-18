import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';

import { NotificationModalComponent } from './notification-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NotificationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { BehaviorSubject } from 'rxjs';

describe('NotificationModalComponent', () => {
  let component: NotificationModalComponent;
  let fixture: ComponentFixture<NotificationModalComponent>;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [NotificationModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should listen to the notification service and handle a value', fakeAsync(() => {
      spyOn(notificationService, 'getModal').and.returnValue(
        new BehaviorSubject(new SuccessNotification('text'))
      );
      spyOn(notificationService, 'setModal');

      component.load();

      tick(4000);
      expect(notificationService.getModal).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    }));

    it('should listen to the notification service and handle an undefined value', fakeAsync(() => {
      spyOn(notificationService, 'getModal').and.returnValue(new BehaviorSubject(undefined));
      spyOn(notificationService, 'setModal');

      component.load();

      tick(4000);
      expect(notificationService.getModal).toHaveBeenCalled();
      expect(notificationService.setModal).not.toHaveBeenCalled();
    }));
  });
});
