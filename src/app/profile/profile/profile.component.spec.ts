import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileComponent } from './profile.component';
import { UserService } from '@userService';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from 'src/app/user/shared/current-user.service';
import { of } from 'rxjs';
import { ActionService } from '@actionService';
import { User } from 'src/app/user/shared/user.model';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChartsModule } from 'ng2-charts';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let notificationService: NotificationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
        ChartsModule,
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
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    currentUserService = TestBed.inject(CurrentUserService);
    actionService = TestBed.inject(ActionService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load data', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(component, 'loadActions');

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
    });
  });

  describe('loadActions', () => {
    it('should load actions', fakeAsync(() => {
      component.weekPaginator = {};
      component.monthPaginator = {};
      
      const actions = [
        { day: 0, month: 1, year: 0, data: {'1': 2} },
        { day: 0, month: 1, year: 0, data: {'2': 2} },
        { day: 0, month: 2, year: 0, data: {'2': 2} },
        { day: 0, month: 3, year: 0, data: {'2': 2} }
      ];

      spyOn(actionService, 'getActions').and.returnValue(Promise.resolve(true));
      spyOn(component, 'sortActions').and.returnValue(actions);

      component.loadActions();

      tick();
      expect(actionService.getActions).toHaveBeenCalled();
      expect(component.sortActions).toHaveBeenCalled();
    }));

    it('should load actions without paginators', fakeAsync(() => {
      component.weekPaginator = null;
      component.monthPaginator = null;
      
      const actions = [
        { day: 0, month: 1, year: 0, data: {'1': 2} },
        { day: 0, month: 1, year: 0, data: {'2': 2} },
        { day: 0, month: 2, year: 0, data: {'2': 2} },
        { day: 0, month: 3, year: 0, data: {'2': 2} }
      ];

      spyOn(actionService, 'getActions').and.returnValue(Promise.resolve(true));
      spyOn(component, 'sortActions').and.returnValue(actions);

      component.loadActions();

      tick();
      expect(actionService.getActions).toHaveBeenCalled();
      expect(component.sortActions).toHaveBeenCalled();
    }));
  });

  describe('sortActions', () => {
    it('should sort and format dates', () => {
      const result = component.sortActions({'2/2/2': {}, '1/1/1': {}});

      expect(result[0].day).toBe(1);
    });
  });

  describe('onFormSubmit', () => {
    it('should update a user record', () => {
      spyOn(userService, 'putUser');
      spyOn(currentUserService, 'setCurrentUser');
      spyOn(notificationService, 'setNotification');

      component.onFormSubmit({});

      expect(userService.putUser).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
      expect(notificationService.setNotification).toHaveBeenCalled();
    });
  });
});
