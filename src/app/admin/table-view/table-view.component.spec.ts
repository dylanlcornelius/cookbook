import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableViewComponent } from './table-view.component';
import { Context } from '@context';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

describe('TableViewComponent', () => {
  let component: TableViewComponent;
  let fixture: ComponentFixture<TableViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatTableModule],
      declarations: [TableViewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(TableViewComponent);
    component = fixture.componentInstance;
    component.context = new Context(
      'title',
      [],
      null,
      () => {},
      () => {},
      () => {},
      () => {}
    );
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
