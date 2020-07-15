import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { NotificationType } from '@notifications';
import { Notification } from 'src/app/shared/notification-modal/notification.model';

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
      service.notification = new BehaviorSubject<Notification>(new Notification(NotificationType.SUCCESS, 'text'));

      service.getNotification().pipe(take(1)).subscribe(notification => {
        expect(notification).toBeDefined();
      });
    });
  });

  describe('setNotification', () => {
    it('should set a subject with a Notification', () => {
      service.setNotification(new Notification(NotificationType.SUCCESS, 'text'));

      service.notification.pipe(take(1)).subscribe(notification => {
        expect(notification).toBeDefined();
      });
    });
  });
});
