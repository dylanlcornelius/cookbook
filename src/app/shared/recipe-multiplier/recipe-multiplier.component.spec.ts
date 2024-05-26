import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeMultiplierComponent } from './recipe-multiplier.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('RecipeMultiplierComponent', () => {
  let component: RecipeMultiplierComponent;
  let fixture: ComponentFixture<RecipeMultiplierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeMultiplierComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(RecipeMultiplierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
