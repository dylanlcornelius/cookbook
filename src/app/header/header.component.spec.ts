import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { AuthService } from '../user/shared/auth.service';

import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Navigation, NavigationMenu } from '@navigation';
import { BehaviorSubject, of } from 'rxjs';
import { NavigationService } from '@navigationService';
import { CurrentUserService } from '@currentUserService';
import { HouseholdService } from '@householdService';
import { User } from '@user';
import { Household } from '@household';
import { RecipeService } from '@recipeService';
import { RouterTestingModule } from '@angular/router/testing';
import { FeedbackService } from '@feedbackService';
import { Feedback } from '@feedback';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let navigationService: NavigationService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let recipeService: RecipeService;
  let feedbackService: FeedbackService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), RouterTestingModule],
      declarations: [HeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    const load = component.load;
    spyOn(component, 'load');
    fixture.detectChanges();
    component.load = load;
    authService = TestBed.inject(AuthService);
    navigationService = TestBed.inject(NavigationService);
    currentUserService = TestBed.inject(CurrentUserService);
    householdService = TestBed.inject(HouseholdService);
    recipeService = TestBed.inject(RecipeService);
    feedbackService = TestBed.inject(FeedbackService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('constructor', () => {
    it('should listen to navigation events', () => {
      const event = new NavigationEnd(1, '/', '/');
      const router = TestBed.inject(Router);
      (<any>router).events.next(event);

      expect(component.route).toEqual('/');
    });

    it('should ignore non navigation events', () => {
      const event = new NavigationStart(1, null);
      const router = TestBed.inject(Router);
      (<any>router).events.next(event);

      expect(component.route).not.toEqual('/');
    });
  });

  describe('load', () => {
    it('should load navs and household invites', () => {
      spyOn(navigationService, 'get').and.returnValue(
        of([new Navigation({ subMenu: NavigationMenu.TOOLS })])
      );
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ uid: 'uid', role: 'admin' }))
      );
      spyOn(feedbackService, 'get').and.returnValue(of([new Feedback({})]));
      spyOn(householdService, 'getInvites').and.returnValue(of([new Household({})]));

      component.load();

      expect(component.desktopNavs.length).toEqual(0);
      expect(component.mobileNavs.length).toEqual(1);
      expect(component.profileNavs.length).toEqual(0);
      expect(component.toolNavs.length).toEqual(1);
      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(feedbackService.get).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
    });

    it('should not load household invites', () => {
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject({}));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(feedbackService, 'get').and.returnValue(of([]));
      spyOn(householdService, 'getInvites').and.returnValue(of([]));

      component.load();

      expect(component.desktopNavs.length).toEqual(1);
      expect(component.mobileNavs.length).toEqual(1);
      expect(component.profileNavs.length).toEqual(0);
      expect(component.toolNavs.length).toEqual(0);
      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(feedbackService.get).toHaveBeenCalled();
      expect(householdService.getInvites).not.toHaveBeenCalled();
    });

    it('should load the continue nav and feature flag navs', () => {
      spyOn(navigationService, 'get').and.returnValue(
        of([
          new Navigation({ link: '/shopping/plan' }),
          new Navigation({ link: '/recipe/books' }),
          new Navigation({ link: '/profile/list', subMenu: NavigationMenu.PROFILE }),
        ])
      );
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject({ id: 'test' }));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(
        of(new User({ uid: 'uid', hasPlanner: true, hasCookbooks: true, hasAdminView: true }))
      );
      spyOn(feedbackService, 'get').and.returnValue(of([]));
      spyOn(householdService, 'getInvites').and.returnValue(of([]));

      component.load();

      expect(component.desktopNavs.length).toEqual(2);
      expect(component.mobileNavs.length).toEqual(2);
      expect(component.profileNavs.length).toEqual(1);
      expect(component.toolNavs.length).toEqual(0);
      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(feedbackService.get).toHaveBeenCalled();
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
