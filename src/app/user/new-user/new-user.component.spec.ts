import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CurrentUserService } from '@currentUserService';
import { ImageService } from '@imageService';
import { User } from '@user';
import { UserService } from '@userService';
import { of } from 'rxjs';

import { NewUserComponent } from './new-user.component';

describe('NewUserComponent', () => {
  let component: NewUserComponent;
  let fixture: ComponentFixture<NewUserComponent>;
  let currentUserService: CurrentUserService;
  let userService: UserService;
  let imageService: ImageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatInputModule,
      ],
      declarations: [ NewUserComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    userService = TestBed.inject(UserService);
    imageService = TestBed.inject(ImageService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load the current user data', () => {
      const user = new User({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve('url'));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });

    it('should load the current user data without an image', () => {
      const user = new User({});

      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(user));
      spyOn(imageService, 'download').and.returnValue(Promise.resolve());

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(imageService.download).toHaveBeenCalled();
    });
  });

  describe('updateImage', () => {
    it('should update a user image', () => {
      component.user = new User({});

      spyOn(userService, 'update');
      spyOn(currentUserService, 'setCurrentUser');

      component.updateImage(true);

      expect(userService.update).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
    });
  });

  describe('submit', () => {
    it('should update a user', () => {
      component.user = new User({});

      spyOn(userService, 'update');
      spyOn(currentUserService, 'setCurrentUser');

      component.firstNameControl.patchValue('Test');
      component.lastNameControl.patchValue('Test');
      component.themeControl.patchValue(true);

      expect(userService.update).toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).toHaveBeenCalled();
    });

    it('should not update a user', () => {
      component.user = new User({});

      spyOn(userService, 'update');
      spyOn(currentUserService, 'setCurrentUser');

      component.submit();

      expect(userService.update).not.toHaveBeenCalled();
      expect(currentUserService.setCurrentUser).not.toHaveBeenCalled();
    });
  });
});