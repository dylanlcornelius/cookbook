import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { Navigation } from '@navigation';
import { NavigationService } from '@navigationService';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let currentUserService: CurrentUserService;
  let navigationService: NavigationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      declarations: [ HomeComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    currentUserService = TestBed.inject(CurrentUserService);
    navigationService = TestBed.inject(NavigationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title in an h2 tag', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h2').textContent).toContain('Welcome to the Cookbook!');
  });

  describe('load', () => {
    it('should load navs', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({})));
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({})]));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(navigationService.get).toHaveBeenCalled();
    });

    it('should load navs with a feature flag', () => {
      spyOn(currentUserService, 'getCurrentUser').and.returnValue(of(new User({ hasPlanner: true })));
      spyOn(navigationService, 'get').and.returnValue(of([new Navigation({ link: '/shopping/plan' })]));

      component.load();

      expect(currentUserService.getCurrentUser).toHaveBeenCalled();
      expect(navigationService.get).toHaveBeenCalled();
    });
  });
});
