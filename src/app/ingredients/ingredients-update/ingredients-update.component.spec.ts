import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsUpdateComponent } from './ingredients-update.component';

describe('IngredientsUpdateComponent', () => {
  let component: IngredientsUpdateComponent;
  let fixture: ComponentFixture<IngredientsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
