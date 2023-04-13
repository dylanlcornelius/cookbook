import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ImageService } from '@imageService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { Validation } from '@validation';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Compressor from 'compressorjs';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  online$: Observable<boolean>;

  @Input()
  id: string;

  @Input()
  updateImage: Function;

  @Input()
  progress;
  @Output()
  progressChange = new EventEmitter<number>();

  @Input()
  image: string;
  @Output()
  imageChange = new EventEmitter<string>();

  constructor(
    private utilService: UtilService,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private validationService: ValidationService,
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
        success: this.readFileEvent
      });
    }
  }

  readFileEvent = (image: File | Blob): void => {
    this.imageService.upload(this.id, image).pipe(takeUntil(this.unsubscribe$)).subscribe(progress => {
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
    this.validationService.setModal(new Validation(
      'Are you sure you want to remove this image?',
      this.deleteFileEvent,
      [path]
    ));
  }

  deleteFileEvent = (path: string): void => {
    this.imageService.deleteFile(path).then(() => {
      this.updateImage(false);
      this.image = undefined;
      this.imageChange.emit(this.image);
    });
  };
}
