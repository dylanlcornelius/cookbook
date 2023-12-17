import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewComponent } from './table-view.component';

describe('TableViewComponent', () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isBoolean', () => {
    it('should return true if an object is a boolean', () => {
      const result = component.isBoolean(true);

      expect(result).toBeTrue();
    });

    it('should return false if an object is not a boolean', () => {
      const result = component.isBoolean('true');

      expect(result).toBeFalse();
    });
  });

  describe('isArray', () => {
    it('should return true if an object is an array', () => {
      const result = component.isArray([]);

      expect(result).toBeTrue();
    });

    it('should return false if an object is not an array', () => {
      const result = component.isArray({});

      expect(result).toBeFalse();
    });
  });
});
