import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ImageService } from '@imageService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Compressor from 'compressorjs';

export type ImageUploadProgress = number | undefined | void;

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss'],
})
export class ImageUploadComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  online$: Observable<boolean>;

  @Input()
  id: string;

  @Input()
  updateImage: (hasImage: boolean) => void;

  @Input()
  progress: ImageUploadProgress;
  @Output()
  progressChange = new EventEmitter<ImageUploadProgress>();

  @Input()
  image: string | undefined;
  @Output()
  imageChange = new EventEmitter<typeof this.image>();

  constructor(
    private utilService: UtilService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private validationService: ValidationService
  ) {
    this.online$ = this.utilService.online$;
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  readFile(event: any): void {
    if (event && event.target && event.target.files[0]) {
      new Compressor(event.target.files[0], {
        quality: 0.6,
        maxHeight: 750,
        maxWidth: 750,
        success: this.readFileEvent,
      });
    }
  }

  readFileEvent = (image: File | Blob): void => {
    this.imageService
      .upload(this.id, image)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((progress) => {
        if (typeof progress === 'string') {
          this.image = progress;
          this.imageChange.emit(this.image);

          this.progress = undefined;
          this.progressChange.emit(this.progress);

          this.updateImage(true);
          this.notificationService.setModal(new SuccessNotification('Image uploaded!'));
        } else {
          this.progress = progress;
          this.progressChange.emit(this.progress);
        }
      });
  };

  deleteFile(path: string): void {
    this.validationService.setModal({
      text: 'Are you sure you want to remove this image?',
      function: this.deleteFileEvent,
      args: [path],
    });
  }

  deleteFileEvent = (path: string): void => {
    this.imageService.deleteFile(path).then(() => {
      this.updateImage(false);
      this.image = undefined;
      this.imageChange.emit(this.image);
    });
  };
}
