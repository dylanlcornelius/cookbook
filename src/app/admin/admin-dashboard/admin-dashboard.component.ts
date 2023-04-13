import { Component, OnDestroy } from '@angular/core';
import { IngredientService } from '@ingredientService';
import { RecipeService } from '@recipeService';
import { UserService } from '@userService';
import { ConfigService } from '@configService';
import { BehaviorSubject, Subject } from 'rxjs';
import { UserIngredientService } from '@userIngredientService';
import { UserItemService } from '@userItemService';
import { takeUntil } from 'rxjs/operators';
import { SuccessNotification } from '@notification';
import { NotificationService, ValidationService } from '@modalService';
import { NavigationService } from '@navigationService';
import { Validation } from '@validation';
import { Context } from '@context';
import { Model } from '@model';
import { MatLegacyTabChangeEvent as MatTabChangeEvent } from '@angular/material/legacy-tabs';
import { CommentService } from '@commentService';
import { HouseholdService } from '@householdService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { TutorialService } from '@tutorialService';
import { FeedbackService } from '@feedbackService';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private refresh$ = new BehaviorSubject(undefined);
  private context$;

  constructor(
    private configService: ConfigService,
    private navigationService: NavigationService,
    private tutorialService: TutorialService,
    private userService: UserService,
    private householdService: HouseholdService,
    private recipeService: RecipeService,
    private commentService: CommentService,
    private recipeHistoryService: RecipeHistoryService,
    private ingredientService: IngredientService,
    private userIngredientService: UserIngredientService,
    private userItemService: UserItemService,
    private validationService: ValidationService,
    private notificationService: NotificationService,
    private feedbackService: FeedbackService,
  ) {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  tabChanged(event: MatTabChangeEvent): void {
    this.unsubscribe$.next();
    const context = this.contexts.find(context => context.title === event.tab.textLabel);

    this.refresh$.subscribe(() => {
      if (this.context$) {
        this.context$.unsubscribe();
      }

      this.context$ = context?.service.get().pipe(takeUntil(this.unsubscribe$)).subscribe((data: Model[]) => {
        context.dataSource = data;
      });
    });
  }

  isBoolean(obj: any): boolean {
    return typeof obj === 'boolean';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }

  add = (context: Context): void => {
    context.service.create(new Model({}).getObject());
  };

  remove = (context: Context, id: string): void => {
    this.validationService.setModal(new Validation(
      `Are you sure you want to delete this document?`,
      this.removeEvent,
      [context, id]
    ));
  };

  removeEvent = (context: Context, id: string): void => {
    context.service.delete(id);
  };

  revert = (): void => {
    this.validationService.setModal(new Validation(
      'Are you sure you want to revert your changes?',
      this.revertEvent,
      []
    ));
  };

  revertEvent = (): void => {
    this.refresh$.next(undefined);
    this.notificationService.setModal(new SuccessNotification('Changes reverted'));
  };

  save = (context: Context): void => {
    this.validationService.setModal(new Validation(
      'Are you sure you want to save your changes?',
      this.saveEvent,
      [context]
    ));
  };

  saveEvent = (context: Context): void => {
    context.service.update(context.dataSource);
    this.notificationService.setModal(new SuccessNotification('Changes saved!'));
  };

  contexts = [
    new Context(
      'Configurations',
      ['name', 'value', 'displayValue', 'order'],
      this.configService,
      this.revert,
      this.save,
      this.remove,
      this.add,
    ),
    new Context(
      'Navs',
      ['name', 'link', 'icon', 'order', 'subMenu', 'isNavOnly'],
      this.navigationService,
      this.revert,
      this.save,
      this.remove,
      this.add,
    ),
    new Context(
      'Tutorials',
      ['text', 'baseUrl', 'url', 'order', 'element', 'position'],
      this.tutorialService,
      this.revert,
      this.save,
      this.remove,
      this.add,
    ),
    new Context(
      'Feedbacks',
      ['description', 'author', 'uid'],
      this.feedbackService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Users',
      ['firstName', 'lastName', 'role', 'theme', 'hasPlanner', 'hasAdminView'],
      this.userService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Households',
      ['name', 'members', 'memberIds', 'invites', 'inviteIds'],
      this.householdService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Recipes',
      ['name', 'link', 'description', 'time', 'calories', 'servings', 'categories', 'steps', 'meanRating', 'ratings', 'uid', 'author', 'status', 'hasImage', 'isVegetarian', 'isVegan', 'isGlutenFree', 'isDairyFree', 'type'],
      this.recipeService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Comments',
      ['author', 'documentId', 'isResolved', 'parent', 'text'],
      this.commentService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Recipe History',
      ['uid', 'recipeId', 'history', 'timesCooked', 'lastDateCooked'],
      this.recipeHistoryService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'Ingredients',
      ['name', 'category', 'amount', 'uom'],
      this.ingredientService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'User Ingredients',
      ['uid', 'ingredients'],
      this.userIngredientService,
      this.revert,
      this.save,
      this.remove,
    ),
    new Context(
      'User Items',
      ['uid', 'items'],
      this.userItemService,
      this.revert,
      this.save,
      this.remove,
    ),
  ];
}
