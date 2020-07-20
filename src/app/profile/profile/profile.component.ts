import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { ActionService } from '@actionService';
import { User } from 'src/app/user/shared/user.model';
import { NotificationType } from '@notifications';
import { ActionLabel } from '../shared/action.enum';
import { ErrorMatcher } from '../../util/error-matcher';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { UserService } from '@userService';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { Notification } from 'src/app/shared/notification-modal/notification.model';
import { ImageService } from 'src/app/util/image.service';
import { UtilService } from 'src/app/shared/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  online$: Observable<boolean>;
  loading: Boolean = true;

  selectedIndex = 0;

  userForm: FormGroup;
  user: User;
  id: string;

  userImage: string;
  userImageProgress;

  actions = {};
  actionsLength = 0;
  week = {pageIndex: 0};

  monthActions = {};
  monthActionsLength = 0;
  month = {pageIndex: 0};

  actionsLabels = [
    'Login',
    'Create Recipe', 'Update Recipe', 'Delete Recipe',
    'Create Ingredient', 'Update Ingredient', 'Delete Ingredient',
    'Create Item', 'Update Item', 'Delete Item',
    'Buy Ingredient', 'Complete Shopping List',
  ];
  actionsColors = [
    '#CCCCCC',
    '#9ef533', '#de33f5', '#f73434',
    '#57f533', '#f533d5', '#f76f34',
    '#33f57a', '#f53397', '#f7a634',
    '#3394f5', '#5733f5',
  ];

  matcher = new ErrorMatcher();

  @ViewChild('weekPaginator') weekPaginator: any;
  @ViewChild('monthPaginator') monthPaginator: any;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private actionService: ActionService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private utilService: UtilService,
  ) {
    this.selectedIndex = this.route.snapshot.data.selectedTabIndex;

    this.online$ = this.utilService.online$;
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;
      this.userForm = this.formBuilder.group({
        uid: [user.uid],
        firstName : [user.firstName, Validators.required],
        lastName : [user.lastName, Validators.required],
        role: [user.role],
        theme: [user.theme],
        simplifiedView: [user.simplifiedView],
        hasImage: [user.hasImage],
        id: [user.id],
      });

      this.imageService.downloadFile(user).then(url => {
        if (url) {
          this.userImage = url;
        }
      }, () => {});

      this.loading = false;

      this.loadActions();
    });
  }

  loadActions() {
    this.actionService.getActions(this.user.uid)?.then((userAction) => {
      const actions = this.sortActions(userAction.actions);

      let index = 0;
      let monthIndex = 0;
      let currentMonth = -1;
      let monthActionArray = [];
      actions.forEach((action, i) => {
        const actionData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

        Object.keys(action.data).forEach(actionKey => {
          actionData[this.actionsLabels.indexOf(ActionLabel[actionKey])] = action.data[actionKey];
        });

        this.actions[index] = {
          data: actionData,
          date: action.month + '/' + action.day + '/' + action.year,
        };

        if ((currentMonth !== action.month) || actions.length - 1 === i) {
          const date = new Date().setMonth(currentMonth - 1);
          const monthName = new Date(date).toLocaleString('default', {month: 'long'});

          if (i !== 0) {
            if (actions.length - 1 === i ) {
              monthActionArray.push({
                data: actionData,
                label: action.month + '/' + action.day + '/' + action.year
              });
            }
            this.monthActions[monthIndex] = {
              data: monthActionArray,
              date: monthName
            };

            monthActionArray = [];
            monthIndex++;
          }

          currentMonth = action.month;
        }

        monthActionArray.push({
          data: actionData,
          label: action.month + '/' + action.day + '/' + action.year
        });

        index++;
      });

      this.actionsLength = Object.keys(this.actions).length;
      this.monthActionsLength = Object.keys(this.monthActions).length;

      this.week.pageIndex = this.actionsLength - 1;
      this.month.pageIndex = this.monthActionsLength - 1;
      if (this.weekPaginator) {
        this.weekPaginator.pageIndex = this.actionsLength - 1;
      }
      if (this.monthPaginator) {
        this.monthPaginator.pageIndex = this.monthActionsLength - 1;
      }
    });
  }

  sortActions(userActions) {
    const dateArray = Object.keys(userActions).map(key => {
      return key.split('/').map(Number);
    });

    dateArray.sort((a, b) => a[0] - b[0]);
    dateArray.sort((a, b) => a[1] - b[1]);
    dateArray.sort((a, b) => a[2] - b[2]);

    return dateArray.map(date => {
      return {
        day: date[0],
        month: date[1],
        year: date[2],
        data: userActions[date[0] + '/' + date[1] + '/' + date[2]]
      };
    });
  }

  readFile(event) {
    if (event && event.target && event.target.files[0]) {
      this.imageService.uploadFile(this.user.id, event.target.files[0]).pipe(takeUntil(this.unsubscribe$)).subscribe(progress => {
        if (typeof progress === 'string') {
          this.userImage = progress;
          this.userImageProgress = undefined;

          const user = new User(this.user);
          user.hasImage = true;
          this.userService.putUser(user);
          this.currentUserService.setCurrentUser(user);
        } else {
          this.userImageProgress = progress;
        }
      });
    }
  }

  deleteFile(path) {
    this.imageService.deleteFile(path).then(() => {

      const user = new User(this.user);
      user.hasImage = false;
      this.userService.putUser(user);
      this.currentUserService.setCurrentUser(user);
      this.userImage = undefined;
    });
  }

  onFormSubmit(form) {
    const user = new User(form);

    this.userService.putUser(user);
    this.currentUserService.setCurrentUser(user);

    this.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Profile Information Updated!'));
  }
}
