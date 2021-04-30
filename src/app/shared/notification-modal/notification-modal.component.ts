import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '@notificationService';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Notification } from '@notification';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss']
})
export class NotificationModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  notification: Notification;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.notificationService.getNotification().pipe(takeUntil(this.unsubscribe$)).subscribe(notification => {
      if (!notification) {
        return;
      }

      this.notification = notification;
      setTimeout(() => {
        this.notificationService.setNotification(undefined);
        this.notification = undefined;
      }, 3000);
    });
  }
}
