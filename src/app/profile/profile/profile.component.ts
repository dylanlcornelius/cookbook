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
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { Notification } from 'src/app/shared/notification-modal/notification.model';
import { ImageService } from 'src/app/util/image.service';
import { UtilService } from 'src/app/shared/util.service';
import { RecipeHistoryService } from 'src/app/recipe/shared/recipe-history.service';
import { RecipeService } from '@recipeService';

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

  users: User[];

  actions = [];
  actionsLength = 0;
  week = {pageIndex: 0};

  matcher = new ErrorMatcher();

  @ViewChild('weekPaginator') weekPaginator: any;

  history = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private currentUserService: CurrentUserService,
    private userService: UserService,
    private actionService: ActionService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private utilService: UtilService,
    private recipeService: RecipeService,
    private recipeHistoryService: RecipeHistoryService
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
    const user$ = this.currentUserService.getCurrentUser();
    const users$ = this.userService.get();

    combineLatest([user$, users$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, users]) => {
      this.users = users;

      this.user = user;
      this.userForm = this.formBuilder.group({
        uid: [user.uid],
        firstName : [user.firstName, Validators.required],
        lastName : [user.lastName, Validators.required],
        defaultShoppingList: [user.defaultShoppingList],
        role: [user.role],
        theme: [user.theme],
        simplifiedView: [user.simplifiedView],
        hasImage: [user.hasImage],
        id: [user.id],
      });

      this.imageService.download(user).then(url => {
        if (url) {
          this.userImage = url;
        }
      }, () => {});

      this.loading = false;

      this.loadActions();
      this.loadHistory();
    });
  }

  loadActions() {
    this.actionService.get(this.user.uid)?.then((userAction) => {
      const sortedActions = this.sortActions(userAction.actions);

      this.actions = sortedActions.map(action => {
        const actionData = Object.keys(action.data).map(key => {
          return { name: ActionLabel[key], value: action.data[key] }
        });

        return {
          data: actionData,
          date: action.month + '/' + action.day + '/' + action.year,
        };
      });

      this.actionsLength = Object.keys(this.actions).length;

      this.week.pageIndex = this.actionsLength - 1;
      if (this.weekPaginator) {
        this.weekPaginator.pageIndex = this.actionsLength - 1;
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

  loadHistory() {
    const recipes$ = this.recipeService.get();
    const recipeHistory$ = this.recipeHistoryService.get(this.user.defaultShoppingList);

    combineLatest([recipes$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipes, histories]) => {
      this.history = histories.map(recipeHistory => ({
        name: recipes.find(recipe => recipe.id === recipeHistory.recipeId)?.name,
        value: recipeHistory.timesCooked
      }));
    });
  }

  readFile(event) {
    if (event && event.target && event.target.files[0]) {
      this.imageService.upload(this.user.id, event.target.files[0]).pipe(takeUntil(this.unsubscribe$)).subscribe(progress => {
        if (typeof progress === 'string') {
          this.userImage = progress;
          this.userImageProgress = undefined;

          const user = new User(this.user);
          user.hasImage = true;
          this.userService.update(user);
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
      this.userService.update(user);
      this.currentUserService.setCurrentUser(user);
      this.userImage = undefined;
    });
  }

  onFormSubmit(form) {
    const user = new User(form);

    this.userService.update(user);
    this.currentUserService.setCurrentUser(user);

    this.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Profile Information Updated!'));
  }
}
