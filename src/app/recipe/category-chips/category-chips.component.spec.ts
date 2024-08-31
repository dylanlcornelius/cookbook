import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryChipsComponent } from './category-chips.component';
import { UtilService } from '@utilService';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Recipe } from '@recipe';

describe('CategoryChipsComponent', () => {
  let component: CategoryChipsComponent;
  let fixture: ComponentFixture<CategoryChipsComponent>;
  let utilService: UtilService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CategoryChipsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    utilService = TestBed.inject(UtilService);

    component.recipe = new Recipe({ id: 'recipe' });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setCategoryFilter', () => {
    it('should set a category filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setCategoryFilter('filter');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('setRestrictionFilter', () => {
    it('should set a restriction filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setRestrictionFilter('isVegetarian');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('setTemperatureFilter', () => {
    it('should set a restriction filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setTemperatureFilter('isServedCold');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });

  describe('setTypeFilter', () => {
    it('should set a restriction filter', () => {
      spyOn(utilService, 'setListFilter');

      component.setTypeFilter('SALAD');

      expect(utilService.setListFilter).toHaveBeenCalled();
    });
  });
});
