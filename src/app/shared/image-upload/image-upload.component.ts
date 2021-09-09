import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ImageService } from '@imageService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { UtilService } from '@utilService';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnDestroy {
  private unsubscribe$ = new Subject();
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
      this.imageService.upload(this.id, event.target.files[0]).pipe(takeUntil(this.unsubscribe$)).subscribe(progress => {
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
    }
  }

  deleteFile(path: string): void {
    this.validationService.setModal({
      id: path,
      text: 'Are you sure you want to remove this image?',
      function: this.deleteFileEvent
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
