import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthService } from '../user/shared/auth.service';
import { fadeInAnimation, fadeInFastAnimation, slideInOutAnimation } from '../theme/animations';
import { User } from '@user';
import { CurrentUserService } from '@currentUserService';
import { NavigationService } from '@navigationService';
import { Navigation, NavigationMenu } from '@navigation';
import { takeUntil } from 'rxjs/operators';
import { HouseholdService } from '@householdService';

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

  constructor(
    private router: Router,
    private authService: AuthService,
    private currentUserService: CurrentUserService,
    private householdService: HouseholdService,
    private navigationService: NavigationService,
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
    this.title = environment.config.title;
    this.isLoggedIn = this.currentUserService.getIsLoggedIn();

    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.navigationService.get().subscribe(navs => {
      this.desktopNavs = navs.filter(({ subMenu }) => !subMenu);
      this.mobileNavs = navs.filter(({ subMenu }) => subMenu !== NavigationMenu.PROFILE);
      this.profileNavs = navs.filter(({ subMenu }) => subMenu === NavigationMenu.PROFILE);
      this.toolNavs = navs.filter(({ subMenu }) => subMenu === NavigationMenu.TOOLS);
    });

    this.currentUserService.getCurrentUser().pipe(takeUntil(this.unsubscribe$)).subscribe(user => {
      this.user = user;

      if (this.user.uid) {
        this.householdService.getInvites(this.user.uid).pipe(takeUntil(this.unsubscribe$)).subscribe(households => {
          this.householdNotifications = households.length ? households.length : undefined;
        });
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
