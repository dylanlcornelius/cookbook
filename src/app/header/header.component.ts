import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../user/shared/auth.service';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../theme/animations';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';
import { NavigationService } from '@navigationService';
import { Navigation, NavigationMenu, Navigations } from '@navigation';
import { takeUntil } from 'rxjs/operators';
import { HouseholdService } from '@householdService';
import { RecipeService } from '@recipeService';
import { FeedbackService } from '@feedbackService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeInAnimation, fadeInFastAnimation, slideInOutAnimation],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  title: string;
  user: User;
  isLoggedIn: Observable<boolean>;
  route: string;
  showNav = false;
  desktopNavs: Navigations = [];
  mobileNavs: Navigations = [];
  profileNavs: Navigations = [];
  toolNavs: Navigations = [];
  householdNotifications: number;
  feedbackNotifications: number;
  continueNav: Navigation;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private navigationService: NavigationService,
    private recipeService: RecipeService,
    private feedbackService: FeedbackService
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event.url) {
        this.route = event.url;
      }

      if (!(event instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngOnInit() {
    this.title = environment.title;
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();

    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    const user$ = this.currentUserService.getCurrentUser();
    const navs$ = this.navigationService.get();
    const recipeForm$ = this.recipeService.getForm();
    const feedbacks$ = this.feedbackService.get();

    combineLatest([user$, navs$, recipeForm$, feedbacks$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([user, navs, form, feedbacks]) => {
        this.user = user;

        if (this.user.uid) {
          this.householdService
            .getInvites(this.user.uid)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(households => {
              this.householdNotifications = households.length ? households.length : undefined;
            });

          this.feedbackNotifications =
            this.user.isAdmin && feedbacks.length ? feedbacks.length : undefined;
        }

        const filteredNavs = navs.filter(
          ({ link }) =>
            (link !== '/shopping/plan' || (link === '/shopping/plan' && user.hasPlanner)) &&
            (link !== '/recipe/books' || (link === '/recipe/books' && user.hasCookbooks)) &&
            (link !== '/profile/list' || (link === '/profile/list' && user.hasAdminView))
        );

        this.desktopNavs = filteredNavs.filter(({ subMenu }) => !subMenu);
        this.mobileNavs = filteredNavs.filter(({ subMenu }) => subMenu !== NavigationMenu.PROFILE);
        this.profileNavs = filteredNavs.filter(({ subMenu }) => subMenu === NavigationMenu.PROFILE);
        this.toolNavs = filteredNavs.filter(({ subMenu }) => subMenu === NavigationMenu.TOOLS);

        if (form) {
          const link = form.id ? `/recipe/edit/${form.id}` : '/recipe/edit';
          this.continueNav = new Navigation({
            id: 'continue',
            name: 'Continue!',
            link,
            order: 0,
            icon: 'edit',
          });
        } else {
          this.continueNav = null;
        }
      });
  }

  toggleNav(): void {
    this.showNav = !this.showNav;
  }

  signOut(): void {
    this.authService.logout();
  }
}
