import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { AuthService } from '../shared/auth.service';
import { User } from '../shared/user.model';
import { HomeComponent } from 'src/app/home/home.component';

import { UserPendingComponent } from './user-pending.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CurrentUserService } from '../shared/current-user.service';

describe('UserPendingComponent', () => {
  let component: UserPendingComponent;
  let fixture: ComponentFixture<UserPendingComponent>;
  let currentUserService: CurrentUserService
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'home', component: HomeComponent}
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
    let currentUserService = TestBed.inject(CurrentUserService);

    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({role: 'pending'})));

    fixture = TestBed.createComponent(UserPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(currentUserService.getCurrentUser).toHaveBeenCalled();
  });

  it('should not redirect a pending user', () => {
    let currentUserService = TestBed.inject(CurrentUserService);

    spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({role: 'admin'})));

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
      let authService = TestBed.inject(AuthService);

      spyOn(authService, 'logout');

      component.signOut();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
