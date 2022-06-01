import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { UserService } from '@userService';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { of } from 'rxjs';
import { ActionService } from '@actionService';
import { User } from '@user';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NotificationService } from '@modalService';
import { ImageService } from '@imageService';
import { RecipeService } from '@recipeService';
import { RecipeHistoryService } from '@recipeHistoryService';
import { Recipe } from '@recipe';
import { RecipeHistory } from '@recipeHistory';
import { HouseholdService } from '@householdService';
import { Household } from '@household';
import { TutorialService } from '@tutorialService';
import { Action } from '@actions';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let actionService: ActionService;
  let notificationService: NotificationService;
  let imageService: ImageService;
  let recipeService: RecipeService;
  let recipeHistoryService: RecipeHistoryService;
  let tutorialService: TutorialService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        NgxChartsModule,
      ],
      providers: [
        UserService
      ],
      declarations: [ ProfileComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    userService = TestBed.inject(UserService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    actionService = TestBed.inject(ActionService);
    notificationService = TestBed.inject(NotificationService);
    imageService = TestBed.inject(ImageService);
    recipeService = TestBed.inject(RecipeService);
    recipeHistoryService = TestBed.inject(RecipeHistoryService);
    tutorialService = TestBed.inject(TutorialService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load data with an image', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userService, 'get').and.returnValue(of([new User({})]));
      spyOn(component, 'loadActions');
      spyOn(component, 'loadHistory');
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
      expect(component.loadHistory).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should load data without an image', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userService, 'get').and.returnValue(of([new User({})]));
      spyOn(component, 'loadActions');
      spyOn(component, 'loadHistory');
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
      expect(component.loadHistory).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should load data and catch an image error', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(householdService, 'get').and.returnValue(of(new Household({ id: 'id' })));
      spyOn(userService, 'get').and.returnValue(of([new User({})]));
      spyOn(component, 'loadActions');
      spyOn(component, 'loadHistory');
      spyOn(imageService, 'download').and.returnValue(Promise.reject());

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.get).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
      expect(component.loadHistory).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });
  });

  describe('loadActions', () => {
    it('should load actions', fakeAsync(() => {
      component.user = new User({uid: 'uid'});
      component.actionPaginator = {};
      
      const actions = [
        { day: 0, month: 1, year: 0, data: {[Action.BUY_INGREDIENT]: 2} },
        { day: 0, month: 1, year: 0, data: {'2': 2} },
        { day: 0, month: 2, year: 0, data: {'2': 2} },
        { day: 0, month: 3, year: 0, data: {'2': 2} }
      ];

      const action = { uid: '', actions: {} };

      spyOn(actionService, 'get').and.returnValue(Promise.resolve(action));
      spyOn(component, 'sortActions').and.returnValue(actions);

      component.loadActions();

      tick();
      expect(actionService.get).toHaveBeenCalled();
      expect(component.sortActions).toHaveBeenCalled();
    }));

    it('should load actions without paginators', fakeAsync(() => {
      component.user = new User({uid: 'uid'});
      component.actionPaginator = null;
      
      const actions = [
        { day: 0, month: 1, year: 0, data: {'1': 2} },
        { day: 0, month: 1, year: 0, data: {'2': 2} },
        { day: 0, month: 2, year: 0, data: {'2': 2} },
        { day: 0, month: 3, year: 0, data: {'2': 2} }
      ];

      const action = { uid: '', actions: {} };

      spyOn(actionService, 'get').and.returnValue(Promise.resolve(action));
      spyOn(component, 'sortActions').and.returnValue(actions);

      component.loadActions();

      tick();
      expect(actionService.get).toHaveBeenCalled();
      expect(component.sortActions).toHaveBeenCalled();
    }));

    it('should handle no actions', fakeAsync(() => {
      component.user = new User({uid: 'uid'});

      spyOn(actionService, 'get').and.returnValue(undefined);
      spyOn(component, 'sortActions');

      component.loadActions();

      tick();
      expect(actionService.get).toHaveBeenCalled();
      expect(component.sortActions).not.toHaveBeenCalled();
    }));
  });

  describe('sortActions', () => {
    it('should sort and format dates', () => {
      const result = component.sortActions({
        '2/2/2': {},
        '1/1/1': { [Action.BUY_INGREDIENT]: 1 },
        '1/2/1': {}
      });

      expect(result[0].year).toBe(1);
      expect(result[1].year).toBe(2);
    });

    it('should sort and format dates', () => {
      const result = component.sortActions({
        '2/2/2': {},
        '1/1/1': {},
        '1/2/1': { [Action.BUY_INGREDIENT]: 1 }
      });

      expect(result[0].year).toBe(1);
      expect(result[1].year).toBe(2);
    });
  });

  describe('loadHistory', () => {
    it('should load histories', () => {
      component.user = new User({});

      spyOn(recipeService, 'get').and.returnValue(of([new Recipe({ id: 'id', name: 'recipe' }), new Recipe({ id: 'id2', name: 'recipe' })]));
      spyOn(recipeHistoryService, 'get').and.returnValue(of([new RecipeHistory({ recipeId: 'id', timesCooked: 2 }), new RecipeHistory({ recipeId: 'id2', timesCooked: 1 })]));

      component.loadHistory();

      expect(component.history.length).toEqual(2);
      expect(component.history[0].name).toEqual('recipe');
      expect(component.history[0].value).toEqual(2);
      expect(recipeService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(component.totalRecipesCooked).toEqual(3);
    });

    it('should load histories with missing recipes', () => {
      component.user = new User({});

      spyOn(recipeService, 'get').and.returnValue(of([new Recipe({ id: 'id', name: 'recipe' })]));
      spyOn(recipeHistoryService, 'get').and.returnValue(of([new RecipeHistory({ recipeId: 'id2', timesCooked: 2 })]));

      component.loadHistory();

      expect(component.history.length).toEqual(0);
      expect(recipeService.get).toHaveBeenCalled();
      expect(recipeHistoryService.get).toHaveBeenCalled();
      expect(component.totalRecipesCooked).toBeUndefined();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', () => {
      component.user = new User({});
      component.userImage = 'url';

      spyOn(userService, 'update');
      spyOn(currentUserService, 'setCurrentUser');

      component.updateImage(true);

      expect(userService.update).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
    });
  });

  describe('onFormSubmit', () => {
    it('should update a user record', () => {
      component.user = new User({});

      spyOn(userService, 'update');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(notificationService, 'setModal');

      component.onFormSubmit({});

      expect(userService.update).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('openTutorial', () => {
    it('should open the tutorial', () => {
      spyOn(tutorialService, 'openTutorial');

      component.openTutorial();

      expect(tutorialService.openTutorial).toHaveBeenCalled();
    });
  });
});
