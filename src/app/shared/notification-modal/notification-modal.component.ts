import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '@modalService';
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
  params: Notification;

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
    this.notificationService.getModal().pipe(takeUntil(this.unsubscribe$)).subscribe((notification: Notification) => {
      if (!notification) {
        return;
      }

      this.params = notification;
      setTimeout(() => {
        this.notificationService.setModal(undefined);
        this.params = undefined;
      }, 3000);
    });
  }
}
