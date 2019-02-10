import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientsDetailComponent } from './ingredients-detail.component';

describe('IngredientsDetailComponent', () => {
  let component: IngredientsDetailComponent;
  let fixture: ComponentFixture<IngredientsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
