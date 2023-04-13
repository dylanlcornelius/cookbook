import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrentUserService } from '@currentUserService';
import { Navigation } from '@navigation';
import { NavigationService } from '@navigationService';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  navs: Navigation[] = [];

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

    combineLatest([user$, navs$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([user, navs]) => {
      this.navs = navs.filter(({ isNavOnly, link }) => !isNavOnly && (link !== '/shopping/plan' || (link === '/shopping/plan' && user.hasPlanner)));
    });
  }
}
