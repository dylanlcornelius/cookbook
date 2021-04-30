import { TestBed } from '@angular/core/testing';

import { NotificationService } from '@notificationService';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Notification, SuccessNotification } from '@notification';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getNotification', () => {
    it('should return a subject of Notification', () => {
      service.notification = new BehaviorSubject<Notification>(new SuccessNotification('text'));

      service.getNotification().pipe(take(1)).subscribe(notification => {
        expect(notification).toBeDefined();
      });
    });
  });

  describe('setNotification', () => {
    it('should set a subject with a Notification', () => {
      service.setNotification(new SuccessNotification('text'));

      service.notification.pipe(take(1)).subscribe(notification => {
        expect(notification).toBeDefined();
      });
    });
  });
});
