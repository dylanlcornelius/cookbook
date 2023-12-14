import { Component, Input } from '@angular/core';
import { Recipe } from '@recipe';
import { CategoryFilter, RestrictionFilter, TypeFilter } from '@recipeFilterService';
import { UtilService } from '@utilService';

@Component({
  selector: 'app-category-chips',
  templateUrl: './category-chips.component.html',
  styleUrls: ['./category-chips.component.scss'],
})
export class CategoryChipsComponent {
  @Input() recipe: Recipe;

  constructor(private utilService: UtilService) {}

  setCategoryFilter = (filter: string): void =>
    this.utilService.setListFilter(new CategoryFilter(filter));
  setRestrictionFilter = (filter: string): void =>
    this.utilService.setListFilter(new RestrictionFilter(filter));
  setTypeFilter = (filter: string): void => this.utilService.setListFilter(new TypeFilter(filter));
}
