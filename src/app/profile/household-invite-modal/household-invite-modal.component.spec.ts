import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { User } from '@user';
import { ModalComponent } from '@modalComponent';

import { HouseholdInviteModalComponent } from './household-invite-modal.component';

describe('HouseholdInviteModalComponent', () => {
  let component: HouseholdInviteModalComponent;
  let fixture: ComponentFixture<HouseholdInviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule],
      declarations: [HouseholdInviteModalComponent, ModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseholdInviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('displayFn', () => {
    it('should return a full name', () => {
      const user = new User({ name: 'name' });

      const result = component.displayFn(user);

      expect(result).toBeDefined();
    });

    it('should return undefined', () => {
      const user = undefined;

      const result = component.displayFn(user);

      expect(result).toBeUndefined();
    });
  });

  describe('cancel', () => {
    it('should close the modal', () => {
      component.Params = undefined;

      spyOn(component.modal, 'close');

      component.cancel();

      expect(component.modal.close).toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should invoke the callback', () => {
      component.Params = {
        function: () => {},
        users: [],
      };

      spyOn(component.params, 'function');
      spyOn(component.modal, 'close');

      component.confirm();

      expect(component.params.function).toHaveBeenCalled();
      expect(component.modal.close).toHaveBeenCalled();
    });
  });
});
