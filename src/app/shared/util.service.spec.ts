import { TestBed } from '@angular/core/testing';

import { UtilService } from '@utilService';
import { Router, RouterModule } from '@angular/router';
import { AuthorFilter, RecipeFilterService } from '@recipeFilterService';
import { RecipeListComponent } from '../recipe/recipe-list/recipe-list.component';
import { User } from '@user';

describe('UtilService', () => {
  let service: UtilService;
  let recipeFilterService: RecipeFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          { path: 'recipe/list', component: RecipeListComponent }
        ])
      ],
    });
    service = TestBed.inject(UtilService);
    recipeFilterService = TestBed.inject(RecipeFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('identify', () => {
    it('should return an id', () => {
      const result = service.identify(0, new User({ id: '1' }));

      expect(result).toEqual('1');
    });
  });

  describe('setListFilter', () => {
    it('should set a filter and redirect to the recipes list page', () => {
      const filter = new AuthorFilter('test');
      const router = TestBed.inject(Router);
      
      spyOn(router, 'navigate');

      service.setListFilter(filter);

      expect(recipeFilterService.selectedFilters).toEqual([filter]);
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
