import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  notification = new BehaviorSubject<Notification>(undefined);

  constructor() { }

  getNotification() {
    return this.notification;
  }

  setNotification(options: Notification) {
    this.notification.next(options);
  }
}
