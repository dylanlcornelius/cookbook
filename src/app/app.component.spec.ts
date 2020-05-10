import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs/internal/observable/of';
import { UserService } from '@userService';
import { User } from './user/shared/user.model';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService);
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should get user data', () => {
    spyOn(userService, 'getCurrentUser').and.returnValue(of(new User({})));
    spyOn(userService, 'getIsLoggedIn').and.returnValue(of(true));
    spyOn(userService, 'getIsGuest').and.returnValue(of(false));

    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(userService.setIsLoggedIn).toHaveBeenCalled();
      expect(userService.setIsGuest).toHaveBeenCalled();
    });
  });
});
