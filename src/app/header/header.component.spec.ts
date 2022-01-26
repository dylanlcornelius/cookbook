import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { AuthService } from '../user/shared/auth.service';

import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Navigation } from '@navigation';
import { BehaviorSubject, of } from 'rxjs';
import { NavigationService } from '@navigationService';
import { CurrentUserService } from '@currentUserService';
import { HouseholdService } from '@householdService';
import { User } from '@user';
import { Household } from '@household';
import { RecipeService } from '@recipeService';
import { RouterTestingModule } from '@angular/router/testing';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let navigationService: NavigationService;
  let currentUserService: CurrentUserService;
  let householdService: HouseholdService;
  let recipeService: RecipeService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        RouterTestingModule
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
    recipeService = TestBed.inject(RecipeService);
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
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject(null));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ uid: 'uid' })));
      spyOn(householdService, 'getInvites').and.returnValue(of([new Household({})]));

      component.load();

      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
    });

    it('should not load household invites', () => {
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject({}));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ uid: 'uid' })));
      spyOn(householdService, 'getInvites').and.returnValue(of([]));

      component.load();

      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(householdService.getInvites).toHaveBeenCalled();
    });

    it('should load the continue nav', () => {
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));
      spyOn(recipeService, 'getForm').and.returnValue(new BehaviorSubject({id: 'test'}));
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ uid: 'uid' })));
      spyOn(householdService, 'getInvites').and.returnValue(of([]));

      component.load();

      expect(navigationService.get).toHaveBeenCalled();
      expect(recipeService.getForm).toHaveBeenCalled();
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
