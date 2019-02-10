import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesCreateComponent } from './recipes-create.component';

describe('RecipesCreateComponent', () => {
  let component: RecipesCreateComponent;
  let fixture: ComponentFixture<RecipesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
