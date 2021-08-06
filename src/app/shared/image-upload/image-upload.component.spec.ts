import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ImageService } from '@imageService';
import { NotificationService, ValidationService } from '@modalService';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ImageUploadComponent } from './image-upload.component';

describe('ImageUploadComponent', () => {
  let component: ImageUploadComponent;
  let fixture: ComponentFixture<ImageUploadComponent>;
  let imageService: ImageService;
  let notificationService: NotificationService;
  let validationService: ValidationService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
      ],
      declarations: [ ImageUploadComponent ],
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    imageService = TestBed.inject(ImageService);
    notificationService = TestBed.inject(NotificationService);
    validationService = TestBed.inject(ValidationService);

    component.updateImage = () => {};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('readFile', () => {
    it('should not upload a blank url', () => {
      spyOn(imageService, 'upload');
      spyOn(component, 'updateImage');

      component.readFile({});

      expect(imageService.upload).not.toHaveBeenCalled();
      expect(component.updateImage).not.toHaveBeenCalled();
      expect(component.image).toBeUndefined();
      expect(component.progress).toBeUndefined();
    });

    it('should upload a file and return progress', () => {
      spyOn(imageService, 'upload').and.returnValue(of(1));
      spyOn(component, 'updateImage');

      component.readFile({target: {files: [{}]}});

      expect(imageService.upload).toHaveBeenCalled();
      expect(component.updateImage).not.toHaveBeenCalled();
      expect(component.image).toBeUndefined();
      expect(component.progress).toEqual(1);
    });

    it('should upload a file and return a file', () => {
      spyOn(imageService, 'upload').and.returnValue(of('url'));
      spyOn(component, 'updateImage');

      component.readFile({target: {files: [{}]}});

      expect(imageService.upload).toHaveBeenCalled();
      expect(component.updateImage).toHaveBeenCalled();
      expect(component.image).toEqual('url');
      expect(component.progress).toBeUndefined();
    });
  });

  describe('deleteFileEvent', () => {
    it('should delete a file', () => {
      spyOn(validationService, 'setModal');

      component.deleteFile('url');

      expect(validationService.setModal).toHaveBeenCalled();
    });
  });

  describe('deleteFileEvent', () => {
    it('should delete a file', fakeAsync(() => {
      component.image = 'url';

      spyOn(imageService, 'deleteFile').and.returnValue(Promise.resolve());
      spyOn(component, 'updateImage');

      component.deleteFileEvent('url');

      tick();
      expect(imageService.deleteFile).toHaveBeenCalled();
      expect(component.updateImage).toHaveBeenCalled();
    }));
  });
});
