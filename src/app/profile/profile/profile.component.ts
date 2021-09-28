import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActionService } from '@actionService';
import { User } from '@user';
import { ActionLabel } from '@actions';
import { ErrorMatcher } from '../../util/error-matcher';
import { CurrentUserService } from '@currentUserService';
import { UserService } from '@userService';
import { Subject, Observable, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { ImageService } from '@imageService';
import { UtilService } from '@utilService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { RecipeService } from '@recipeService';
import { HouseholdService } from '@householdService';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  online$: Observable<boolean>;
  loading = true;

  selectedIndex = 0;

  userForm: FormGroup;
  user: User;
  householdId: string;
  id: string;

  userImage: string;
  userImageProgress;

  users: User[];

  actions = [];
  actionsLength = 0;
  week = {pageIndex: 0};

  matcher = new ErrorMatcher();

  @ViewChild(MatPaginator) weekPaginator: any;

  history = [];

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private userService: UserService,
    private actionService: ActionService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private utilService: UtilService,
    private recipeService: RecipeService,
    private recipeHistoryService: RecipeHistoryService,
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

  load(): void {
    const user$ = this.currentUserService.getCurrentUser();
    const users$ = this.userService.get();

    combineLatest([user$, users$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, users]) => {
      this.users = users;

      this.user = user;

      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        this.userForm = this.formBuilder.group({
          uid: [user.uid],
          firstName : [user.firstName, Validators.required],
          lastName : [user.lastName, Validators.required],
          role: [user.role],
          theme: [user.theme],
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
    });
  }

  loadActions(): void {
    this.actionService.get(this.user.uid)?.then((userAction) => {
      const sortedActions = this.sortActions(userAction.actions);

      this.actions = sortedActions.map(action => {
        const actionData = Object.keys(action.data).map(key => {
          return { name: ActionLabel[key], value: action.data[key] };
        });

        return {
          data: actionData,
          date: `${action.month}/${action.day}/${action.year}`,
        };
      });

      this.actionsLength = Object.keys(this.actions).length;

      this.week.pageIndex = this.actionsLength - 1;
      if (this.weekPaginator) {
        this.weekPaginator.pageIndex = this.actionsLength - 1;
      }
    });
  }

  sortActions(userActions: any): { day: number, month: number, year: number, data: any }[] {
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
        data: userActions[`${date[0]}/${date[1]}/${date[2]}`]
      };
    });
  }

  loadHistory(): void {
    const recipes$ = this.recipeService.get();
    const recipeHistory$ = this.recipeHistoryService.get(this.householdId);

    combineLatest([recipes$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipes, histories]) => {
      this.history = histories
        .reduce((list, recipeHistory) => {
          const recipe = recipes.find(recipe => recipe.id === recipeHistory.recipeId);

          if (recipe) {
            list.push({name: recipe.name, value: recipeHistory.timesCooked});
          }
          return list;
          }, [])
        .sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  updateImage = (hasImage: boolean): void => {
    this.user.hasImage = hasImage;
    this.userService.update(this.user.getObject(), this.user.getId());
    this.currentUserService.setCurrentUser(this.user);
  };

  onFormSubmit(form: any): void {
    const user = new User(form);

    this.userService.update(user.getObject(), user.getId());
    this.currentUserService.setCurrentUser(user);
    this.notificationService.setModal(new SuccessNotification('Profile updated!'));
  }
}
