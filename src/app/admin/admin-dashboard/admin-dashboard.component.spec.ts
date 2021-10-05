import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '@configService';
import { of } from 'rxjs';
import { NotificationService, ValidationService } from '@modalService';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let configService: ConfigService;
  let validationService: ValidationService;
  let notificationService: NotificationService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        MatTableModule
      ],
      declarations: [ AdminDashboardComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
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
      event.tab = new MatTab(null, null);
      event.tab.textLabel = 'Admin Dashboard';

      spyOn(configService, 'get');

      component.tabChanged(event);

      expect(configService.get).not.toHaveBeenCalled();
    });

    it('should load a collection', () => {
      const event = new MatTabChangeEvent();
      event.tab = new MatTab(null, null);
      event.tab.textLabel = 'Configurations';

      spyOn(configService, 'get').and.returnValue(of([]));

      component.tabChanged(event);
      component.revertEvent();

      expect(configService.get).toHaveBeenCalledTimes(2);
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

  describe('add', () => {
    it('should create a document', () => {
      spyOn(configService, 'create');

      component.add(component.contexts[0]);

      expect(configService.create).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should remove a user with a first or last name', () => {
      spyOn(validationService, 'setModal');
     
      component.remove(component.contexts[0], 'id');

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
     
      component.revert();

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
     
      component.save(component.contexts[0]);

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
