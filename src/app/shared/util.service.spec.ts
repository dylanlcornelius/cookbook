import { TestBed } from '@angular/core/testing';

import { UtilService } from './util.service';
import { Router, RouterModule } from '@angular/router';
import { RecipeService } from '@recipeService';
import { RecipeListComponent } from '../recipe/recipe-list/recipe-list.component';

describe('UtilService', () => {
  let service: UtilService;
  let recipeService: RecipeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([
          {path: 'recipe/list', component: RecipeListComponent}
        ])
      ],
    });
    service = TestBed.inject(UtilService);
    recipeService = TestBed.inject(RecipeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('identify', () => {
    it('should return an id', () => {
      const result = service.identify(0, {id: 1});

      expect(result).toEqual(1);
    });
  });

  describe('setListFilter', () => {
    it('should set a filter and redirect to the recipes list page', () => {
      const router = TestBed.inject(Router);
      
      spyOn(router, 'navigate');

      service.setListFilter('filter');

      expect(recipeService.selectedFilters).toEqual(['filter']);
      expect(router.navigate).toHaveBeenCalled();
    });
  });
});
