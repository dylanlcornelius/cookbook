import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { Navigations } from '@navigation';
import { NavigationService } from '@navigationService';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fadeInAnimation } from '../theme/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInAnimation],
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  navs: Navigations = [];

  constructor(
    private currentUserService: CurrentUserService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    const user$ = this.currentUserService.getCurrentUser();
    const navs$ = this.navigationService.get();

    combineLatest([user$, navs$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([user, navs]) => {
        this.navs = navs.filter(
          ({ isNavOnly, link }) =>
            !isNavOnly &&
            (link !== '/shopping/plan' || (link === '/shopping/plan' && user.hasPlanner)) &&
            (link !== '/recipe/books' || (link === '/recipe/books' && user.hasCookbooks)) &&
            (link !== '/profile/list' || (link === '/profile/list' && user.hasAdminView))
        );
      });
  }
}
