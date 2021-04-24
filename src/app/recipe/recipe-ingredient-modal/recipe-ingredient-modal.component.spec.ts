import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ModalComponent } from 'src/app/shared/modal/modal.component';

import { RecipeIngredientModalComponent } from './recipe-ingredient-modal.component';

describe('RecipeIngredientModalComponent', () => {
  let component: RecipeIngredientModalComponent;
  let fixture: ComponentFixture<RecipeIngredientModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RecipeIngredientModalComponent,
        ModalComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeIngredientModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('select', () => {
    it('should add when selected', () => {
      component.selectionCount = 0;

      component.select(true);

      expect(component.selectionCount).toEqual(1);
    });

    it('should subtract when unselected', () => {
      component.selectionCount = 1;

      component.select(false);

      expect(component.selectionCount).toEqual(0);
    });
  });

  describe('add', () => {
    beforeEach(() => {
      component.params = {
        function: (_self, _ingredients) => {},
        self: this,
        ingredients: []
      };
    });

    it('should use all ingredients', () => {
      component.params.ingredients = [{}];

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.add();

      expect(component.params.function).toHaveBeenCalledWith(this, component.params.ingredients);
      expect(component.modal.close).toHaveBeenCalled();
    });

    it('should use only selected ingredients', () => {
      component.params.ingredients = [{ selected: true }, { selected: false }];

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.add();

      expect(component.params.function).toHaveBeenCalledWith(this, [{ selected: true }]);
      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      spyOn(component.modal, 'close');

      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
