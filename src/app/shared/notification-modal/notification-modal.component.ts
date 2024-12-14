import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '@modalService';
import { concat, of, Subject, timer } from 'rxjs';
import { concatMap, debounceTime, filter, ignoreElements, takeUntil } from 'rxjs/operators';
import { Notification } from '@notification';

const DISPLAY_TIME = 2000;

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.scss'],
})
export class NotificationModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  params?: Notification;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    // listen for notifications and delay subsequent notifications
    this.notificationService
      .getModal()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((x) => !!x),
        concatMap((x) => concat(of(x), timer(DISPLAY_TIME).pipe(ignoreElements())))
      )
      .subscribe((notification: Notification) => {
        this.params = notification;
      });

    // wait for notifications to stop
    this.notificationService
      .getModal()
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((x) => !!x),
        concatMap((x) => concat(of(x), timer(DISPLAY_TIME).pipe(ignoreElements()))),
        debounceTime(DISPLAY_TIME + 500)
      )
      .subscribe(() => {
        this.notificationService.setModal(undefined);
        this.params = undefined;
      });
  }
}
