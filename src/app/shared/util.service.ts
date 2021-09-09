import { Injectable } from '@angular/core';
import { Filter, RecipeFilterService } from '@recipeFilterService';
import { Router } from '@angular/router';
import { Observable, merge, of, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { User } from '@user';
import { Recipe } from '@recipe';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  online$: Observable<boolean>;

  constructor(
    private router: Router,
    private recipeFilterService: RecipeFilterService
  ) {
    this.online$ = merge(
      of(navigator.onLine),
      fromEvent(window, 'online').pipe(mapTo(true)),
      fromEvent(window, 'offline').pipe(mapTo(false)),
    );
  }

  public identify(_index: number, item: User | Recipe): string {
    return item.id;
  }

  public setListFilter(filter: Filter): void {
    this.recipeFilterService.selectedFilters = [filter];
    this.router.navigate(['/recipe/list']);
  }
}
