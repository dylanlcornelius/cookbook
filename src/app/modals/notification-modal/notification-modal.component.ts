/*
** DROP THIS IN HTML **
<app-notification-modal [notificationModalParams]="notificationModalParams"></app-notification-modal>

** DROP THIS IN TYPESCRIPT **
-- path is optional --
import { Notification } from 'src/app/modals/notification-modal/notification.enum';
notificationModalParams;

this.notificationModalParams = {
  self: self,
  type: Notification.SUCCESS,
  path: 'path',
  text: 'Text!'
};
*/

import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-modal',
  templateUrl: './notification-modal.component.html',
  styleUrls: ['./notification-modal.component.css']
})
export class NotificationModalComponent implements OnChanges {

  @Input()
  notificationModalParams;

  constructor(
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (this.notificationModalParams) {
      if (changes.notificationModalParams) {
        setTimeout(() => {
          if (changes.notificationModalParams.currentValue.path) {
            this.router.navigate([changes.notificationModalParams.currentValue.path]);
          }
          this.notificationModalParams = undefined;
        }, 2000);
      }
    }
  }
}
