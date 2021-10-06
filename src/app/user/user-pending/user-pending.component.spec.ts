import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/auth.service';
import { ROLE, User } from '@user';
import { HomeComponent } from 'src/app/home/home.component';

import { UserPendingComponent } from './user-pending.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '@currentUserService';

describe('UserPendingComponent', () => {
  let component: UserPendingComponent;
  let fixture: ComponentFixture<UserPendingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'home', component: HomeComponent }
        ])
      ],
      declarations: [ UserPendingComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should redirect a pending user', () => {
    const currentUserService = TestBed.inject(CurrentUserService);

    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({role: ROLE.PENDING})));

    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(currentUserService.getCurrentUser).toHaveBeenCalled();
  });

  it('should not redirect a pending user', () => {
    const currentUserService = TestBed.inject(CurrentUserService);

    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({role: ROLE.ADMIN})));

    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(currentUserService.getCurrentUser).toHaveBeenCalled();
  });

  describe('signOut', () => {
    it('should log out', () => {
      fixture = TestBed.createComponent(UserPendingComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      const authService = TestBed.inject(AuthService);

      spyOn(authService, 'logout');

      component.signOut();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
