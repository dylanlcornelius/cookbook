import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadingModalComponent } from './loading-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoadingComponent', () => {
  let component: LoadingModalComponent;
  let fixture: ComponentFixture<LoadingModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingModalComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
