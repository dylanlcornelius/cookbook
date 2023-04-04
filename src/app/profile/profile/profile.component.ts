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
import { Action, ActionLabel } from '@actions';
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
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';

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
  currentUser: User;
  user: User;
  householdId: string;
  id: string;

  userImage: string;
  userImageProgress;

  users: User[];

  actions = [];
  actionsLength = 0;
  actionPage = { pageIndex: 0 };

  matcher = new ErrorMatcher();

  @ViewChild(MatPaginator) actionPaginator: any;

  history = [];
  totalRecipesCooked: number;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loadingService: LoadingService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private userService: UserService,
    private actionService: ActionService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private utilService: UtilService,
    private recipeService: RecipeService,
    private recipeHistoryService: RecipeHistoryService,
    private tutorialService: TutorialService,
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
    this.loading = this.loadingService.set(true);
    const params$ = this.route.params;
    const user$ = this.currentUserService.getCurrentUser();
    const users$ = this.userService.get();

    combineLatest([params$, user$, users$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([params, user, users]) => {
      this.currentUser = user;
      this.users = users;

      const paramId = params['id'];
      this.user = paramId && this.currentUser.isAdmin ? this.users.find(({ id }) => id === paramId) : user;

      this.householdService.get(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(household => {
        this.householdId = household.id;

        this.userForm = this.formBuilder.group({
          uid: [this.user.uid],
          firstName : [this.user.firstName, Validators.required],
          lastName : [this.user.lastName, Validators.required],
          role: [this.user.role],
          theme: [this.user.theme],
          hasImage: [this.user.hasImage],
          hasAdminView: [this.user.hasAdminView],
          id: [this.user.id],
        });
  
        this.imageService.download(this.user).then(url => {
          if (url) {
            this.userImage = url;
          }
        }, () => {});
  
        this.loading = this.loadingService.set(false);
  
        this.loadActions();
        this.loadHistory();
      });
    });
  }

  loadActions(): void {
    this.actionService.get(this.user.uid)?.then((userAction) => {
      const sortedActions = this.sortActions(userAction.actions);

      this.actions = sortedActions.map(action => {
        const actionData = Object.keys(action.data)
          .filter(key => ActionLabel[key])
          .map(key => ({ name: ActionLabel[key], value: action.data[key] }));

        return {
          data: actionData,
          date: action.year,
        };
      });

      this.actionsLength = Object.keys(this.actions).length;

      this.actionPage.pageIndex = this.actionsLength - 1;
      if (this.actionPaginator) {
        this.actionPaginator.pageIndex = this.actionsLength - 1;
      }
    });
  }

  sortActions(userActions: any): { year: number, data: any }[] {
    const dateArray = Object.keys(userActions).map(key => {
      return key.split('/').map(Number);
    });

    dateArray.sort((a, b) => a[2] - b[2]);

    return dateArray.map(date => {
      return {
        year: date[2],
        data: userActions[date.join('/')]
      };
    }).reduce((yearList, dateActions) => {
      const yearActions = yearList.find(({ year }) => year === dateActions.year);
      if (yearActions) {
        for (const action of Object.values(Action)) {
          if (yearActions.data[action] || dateActions.data[action]) {
            yearActions.data[action] = (yearActions.data[action] || 0) + (dateActions.data[action] || 0);
          }
        }
      } else {
        yearList.push(dateActions);
      }

      return yearList;
    }, []);
  }

  loadHistory(): void {
    const recipes$ = this.recipeService.get();
    const recipeHistory$ = this.recipeHistoryService.get(this.householdId);

    combineLatest([recipes$, recipeHistory$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([recipes, histories]) => {
      let total = 0;

      this.history = histories
        .reduce((list, recipeHistory) => {
          const recipe = recipes.find(recipe => recipe.id === recipeHistory.recipeId);

          if (recipe) {
            list.push({name: recipe.name, value: recipeHistory.timesCooked});
            total += recipeHistory.timesCooked;
          }
          return list;
          }, [])
        .sort(({ name: a }, { name: b }) => a.localeCompare(b))
        .sort(({ value: a }, { value: b }) => b - a);
      
      if (total > 0) {
        this.totalRecipesCooked = total;
      }
    });
  }

  updateImage = (hasImage: boolean): void => {
    this.user.hasImage = hasImage;
    this.userService.update(this.user.getObject(), this.user.getId());
    if (this.currentUser === this.user) {
      this.currentUserService.setCurrentUser(this.user);
    }
  };

  onFormSubmit(form: any): void {
    form.creationDate = this.user.creationDate;
    form.hasPlanner = this.user.hasPlanner;
    const user = new User(form);

    this.userService.update(user.getObject(), user.getId());
    if (this.currentUser === this.user) {
      this.currentUserService.setCurrentUser(user);
    }
    this.notificationService.setModal(new SuccessNotification('Profile updated!'));
  }

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
