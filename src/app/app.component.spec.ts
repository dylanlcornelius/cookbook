import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { User } from '@user';

import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from './user/shared/current-user.service';

describe('AppComponent', () => {
  let currentUserService: CurrentUserService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    }).compileComponents();

    currentUserService = TestBed.inject(CurrentUserService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should get user data', () => {
    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
    spyOn(currentUserService, 'getIsLoggedIn').and.returnValue(of(true));
    spyOn(currentUserService, 'getIsGuest').and.returnValue(of(false));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    expect(currentUserService.getCurrentUser).toHaveBeenCalled();
    expect(currentUserService.getIsLoggedIn).toHaveBeenCalled();
    expect(currentUserService.getIsGuest).toHaveBeenCalled();
  });
});
