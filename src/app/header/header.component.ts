import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../user/shared/auth.service';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../theme/animations';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';
import { NavigationService } from '@navigationService';
import { Navigation, NavigationMenu } from '@navigation';
import { takeUntil } from 'rxjs/operators';
import { HouseholdService } from '@householdService';
import { RecipeService } from '@recipeService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeInAnimation, fadeInFastAnimation, slideInOutAnimation]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  title: string;
  user: User;
  isLoggedIn: Observable<boolean>;
  route: string;
  showNav = false;
  desktopNavs: Navigation[] = [];
  mobileNavs: Navigation[] = [];
  profileNavs: Navigation[] = [];
  toolNavs: Navigation[] = [];
  householdNotifications: number;
  continueNav: Navigation;

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private navigationService: NavigationService,
    private recipeService: RecipeService,
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

    combineLatest([user$, navs$, recipeForm$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, navs, form]) => {
      this.user = user;

      if (this.user.uid) {
        this.householdService.getInvites(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(households => {
          this.householdNotifications = households.length ? households.length : undefined;
        });
      }
      
      this.desktopNavs = navs.filter(({ subMenu, link }) => !subMenu && (link !== '/shopping/plan' || (link === '/shopping/plan' && user.hasPlanner)));
      this.mobileNavs = navs.filter(({ subMenu, link }) => subMenu !== NavigationMenu.PROFILE && (link !== '/shopping/plan' || (link === '/shopping/plan' && user.hasPlanner)));
      this.profileNavs = navs.filter(({ subMenu }) => subMenu === NavigationMenu.PROFILE);
      this.toolNavs = navs.filter(({ subMenu }) => subMenu === NavigationMenu.TOOLS);

      if (form) {
        const link = form.id ? `/recipe/edit/${form.id}` : '/recipe/edit';
        this.continueNav = new Navigation({ id: 'continue', name: 'Continue!', link, order: 0, icon: 'edit' });
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
