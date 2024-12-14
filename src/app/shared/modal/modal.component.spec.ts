import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalComponent, ModalComponentParams } from '@modalComponent';

describe('ModalComponent', () => {
  let component: ModalComponent<ModalComponentParams>;
  let fixture: ComponentFixture<ModalComponent<ModalComponentParams>>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModalComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('open', () => {
    it('should set params to true', () => {
      component.params = undefined;

      component.open();

      expect(component.params).toBeTrue();
    });
  });

  describe('close', () => {
    it('should set params to undefined', () => {
      component.params = {};

      component.close();

      expect(component.params).toBeUndefined();
    });

    it('should set params to undefined and callback', () => {
      component.params = { callback: () => {} };

      spyOn(component.params, 'callback' as never);

      component.close();

      expect(component.params).toBeUndefined();
    });
  });
});
