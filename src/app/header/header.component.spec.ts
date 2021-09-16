import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AuthService } from '../user/shared/auth.service';

import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Navigation } from '@navigation';
import { of } from 'rxjs';
import { NavigationService } from '@navigationService';
import { CurrentUserService } from '@currentUserService';
import { HouseholdService } from '@householdService';
import { User } from '@user';
import { Household } from '@household';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let navigationService: NavigationService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      declarations: [ HeaderComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService = TestBed.inject(AuthService);
    navigationService = TestBed.inject(NavigationService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load', () => {
    it('should load navs and household invites', () => {
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ uid: 'uid' })));
      spyOn(householdService, 'getInvites').and.returnValue(of([new Household({})]));

      component.load();

      expect(navigationService.get).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
    });

    it('should not load household invites', () => {
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ uid: 'uid' })));
      spyOn(householdService, 'getInvites').and.returnValue(of([]));

      component.load();

      expect(navigationService.get).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
    });
  });
  
  describe('toggleNav', () => {
    it('should invert the nav boolean', () => {
      component.toggleNav();

      expect(component.showNav).toBeTruthy();
    });
  });

  describe('signOut', () => {
    it('should logout', () => {
      spyOn(authService, 'logout');

      component.signOut();

      expect(authService.logout).toHaveBeenCalled();
    });
  });
});
