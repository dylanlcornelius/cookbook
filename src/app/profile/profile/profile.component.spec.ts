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
import { ImageService } from 'src/app/util/image.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let currentUserService: CurrentUserService;
  let actionService: ActionService;
  let notificationService: NotificationService;
  let imageService: ImageService;

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
    imageService = TestBed.inject(ImageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load data with an image', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(component, 'loadActions');
      spyOn(imageService, 'downloadFile').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
      expect(imageService.downloadFile).toHaveBeenCalled();
    });

    it('should load data without an image', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(component, 'loadActions');
      spyOn(imageService, 'downloadFile').and.returnValue(Promise.resolve());

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(component.loadActions).toHaveBeenCalled();
      expect(imageService.downloadFile).toHaveBeenCalled();
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

  describe('readFile', () => {
    it('should not upload a blank url', () => {
      spyOn(imageService, 'uploadFile');
      spyOn(userService, 'putUser');

      component.readFile({});

      expect(imageService.uploadFile).not.toHaveBeenCalled();
      expect(userService.putUser).not.toHaveBeenCalled();
      expect(component.userImage).toBeUndefined();
      expect(component.userImageProgress).toBeUndefined();
    });

    it('should upload a file and return progress', () => {
      component.user = new User({});

      spyOn(imageService, 'uploadFile').and.returnValue(of(1));
      spyOn(userService, 'putUser');

      component.readFile({target: {files: [{}]}});

      expect(imageService.uploadFile).toHaveBeenCalled();
      expect(userService.putUser).not.toHaveBeenCalled();
      expect(component.userImage).toBeUndefined();
      expect(component.userImageProgress).toEqual(1);
    });

    it('should upload a file and return a file', () => {
      component.user = new User({});

      spyOn(imageService, 'uploadFile').and.returnValue(of('url'));
      spyOn(userService, 'putUser');

      component.readFile({target: {files: [{}]}});

      expect(imageService.uploadFile).toHaveBeenCalled();
      expect(userService.putUser).toHaveBeenCalled();
      expect(component.userImage).toEqual('url');
      expect(component.userImageProgress).toBeUndefined();
    });
  });

  describe('deleteFile', () => {
    it('should delete a file', fakeAsync(() => {
      component.user = new User({});
      component.userImage = 'url';

      spyOn(imageService, 'deleteFile').and.returnValue(Promise.resolve());
      spyOn(userService, 'putUser');

      component.deleteFile('url');

      tick();
      expect(imageService.deleteFile).toHaveBeenCalled();
      expect(userService.putUser).toHaveBeenCalled();
    }));
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
