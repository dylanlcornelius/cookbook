import { Injectable } from '@angular/core';
import { RecipeFilterService } from '@recipeFilterService';
import { Router } from '@angular/router';
import { Observable, merge, of, fromEvent } from 'rxjs';
import { mapTo } from 'rxjs/operators';

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

  public identify(_index, item) {
    return item.id;
  }

  public setListFilter(filter) {
    this.recipeFilterService.selectedFilters = [filter];
    this.router.navigate(['/recipe/list']);
  }
}
