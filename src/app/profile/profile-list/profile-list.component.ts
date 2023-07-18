import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '@recipeService';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { ImageService } from '@imageService';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@userService';
import { UtilService } from '@utilService';
import { Router } from '@angular/router';
import { AuthorFilter } from '@recipeFilterService';
import { LoadingService } from '@loadingService';
import { CurrentUserService } from '@currentUserService';
import { User } from '@user';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss'],
})
export class ProfileListComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;

  dataSource;
  id: string;
  currentUser: User;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private userService: UserService,
    private utilService: UtilService,
    private currentUserService: CurrentUserService
  ) {}

  identify = this.utilService.identify;
  setAuthorFilter = (filter: string): void =>
    this.utilService.setListFilter(new AuthorFilter(filter));

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.loading = this.loadingService.set(true);
    const user$ = this.currentUserService.getCurrentUser();
    const users$ = this.userService.get();
    const recipes$ = this.recipeService.get();

    combineLatest([user$, users$, recipes$])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(([user, users, recipes]) => {
        this.currentUser = user;
        const recipeCounts = {};

        recipes.forEach(recipe => {
          if (!recipeCounts[recipe.uid]) {
            recipeCounts[recipe.uid] = 0;
          }
          recipeCounts[recipe.uid]++;
        });

        users.forEach(user => {
          user.recipeCount = recipeCounts[user.uid] || 0;

          user.ratingCount = recipes.reduce<number>((sum, recipe) => {
            if (recipe.ratings.find(rating => rating.uid === user.uid)) {
              sum++;
            }
            return sum;
          }, 0);

          this.imageService.download(user).then(
            url => {
              if (url) {
                user.image = url;
              }
            },
            () => {}
          );
        });

        users.sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1));

        this.dataSource = new MatTableDataSource(users);
        this.dataSource.paginator = this.paginator;

        this.loading = this.loadingService.set(false);
      });
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
