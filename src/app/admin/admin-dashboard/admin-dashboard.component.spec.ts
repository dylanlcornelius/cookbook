import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@configService';
import { NotificationService, ValidationService } from '@modalService';
import { of } from 'rxjs';
import { AdminDashboardComponent } from './admin-dashboard.component';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let configService: ConfigService;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, MatTableModule],
      declarations: [AdminDashboardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    configService = TestBed.inject(ConfigService);
    validationService = TestBed.inject(ValidationService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('tabChanged', () => {
    it('should not load a collection', () => {
      const event = new MatTabChangeEvent();
      event.tab = new MatTab(null as any, null);
      event.tab.textLabel = 'Admin Dashboard';

      spyOn(configService, 'getAll');

      component.tabChanged(event);

      expect(configService.getAll).not.toHaveBeenCalled();
    });

    it('should load a collection', () => {
      const event = new MatTabChangeEvent();
      event.tab = new MatTab(null as any, null);
      event.tab.textLabel = 'Configurations';

      spyOn(configService, 'getAll').and.returnValue(of([]));

      component.tabChanged(event);
      component.revertEvent();

      expect(configService.getAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('add', () => {
    it('should create a document', () => {
      spyOn(configService, 'create');

      component.contexts[0].add?.();

      expect(configService.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user with a first or last name', () => {
      spyOn(validationService, 'setModal');

      component.contexts[0].remove('id');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('removeEvent', () => {
    it('should remove a document', () => {
      spyOn(configService, 'delete');

      component.removeEvent(component.contexts[0], 'id');

      expect(configService.delete).toHaveBeenCalled();
    });
  });

  describe('revert', () => {
    it('should revert all collection changes', () => {
      spyOn(validationService, 'setModal');

      component.contexts[0].revert();

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('revertEvent', () => {
    it('should revert all collection changes', () => {
      spyOn(notificationService, 'setModal');

      component.revertEvent();

      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });

  describe('save', () => {
    it('should save all collection changes', () => {
      spyOn(validationService, 'setModal');

      component.contexts[0].save();

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('saveEvent', () => {
    it('should save all collection changes', () => {
      spyOn(configService, 'update');
      spyOn(notificationService, 'setModal');

      component.saveEvent(component.contexts[0]);

      expect(configService.update).toHaveBeenCalled();
      expect(notificationService.setModal).toHaveBeenCalled();
    });
  });
});
