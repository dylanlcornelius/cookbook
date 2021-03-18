import { Component, OnInit, ViewChild } from '@angular/core';
import { RecipeService } from '@recipeService';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ImageService } from 'src/app/util/image.service';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '@userService';
import { UtilService } from 'src/app/shared/util.service';
import { Router } from '@angular/router';
import { AuthorFilter } from '@recipeFilterService';

@Component({
  selector: 'app-profile-list',
  templateUrl: './profile-list.component.html',
  styleUrls: ['./profile-list.component.scss']
})
export class ProfileListComponent implements OnInit {
  private unsubscribe$ = new Subject();
  loading: Boolean = true;

  dataSource;
  id: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private recipeService: RecipeService,
    private imageService: ImageService,
    private userService: UserService,
    private utilService: UtilService,
  ) { }

  identify = this.utilService.identify;
  setAuthorFilter = (filter) => this.utilService.setListFilter(new AuthorFilter(filter));

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    const users$ = this.userService.get();
    const recipes$ = this.recipeService.get();

    combineLatest([users$, recipes$]).pipe(takeUntil(this.unsubscribe$)).subscribe(([users, recipes]) => {
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
        }, 0)

        this.imageService.download(user).then(url => {
          if (url) {
            user.image = url;
          }
        }, () => {});
      });

      users.sort((a, b) => {
        const aName = (a.firstName + ' ' + a.lastName).toLowerCase();
        const bName = (b.firstName + ' ' + b.lastName).toLowerCase();
        return aName < bName ? -1 : 1;
      })

      this.dataSource = new MatTableDataSource(users);
      this.dataSource.paginator = this.paginator;

      this.loading = false;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
