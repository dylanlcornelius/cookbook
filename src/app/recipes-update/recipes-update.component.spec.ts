import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesUpdateComponent } from './recipes-update.component';

describe('RecipesUpdateComponent', () => {
  let component: RecipesUpdateComponent;
  let fixture: ComponentFixture<RecipesUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
