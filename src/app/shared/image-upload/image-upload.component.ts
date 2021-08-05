import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class ImageUploadComponent implements OnInit {
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

  ngOnInit(): void {}

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  readFile(event) {
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

  deleteFile(path) {
    this.validationService.setModal({
      id: path,
      self: this,
      text: 'Are you sure you want to remove this image?',
      function: this.deleteFileEvent
    });
  }

  deleteFileEvent(self, path) {
    self.imageService.deleteFile(path).then(() => {
      self.updateImage(false);
      self.image = undefined;
      self.imageChange.emit(self.image);
    });
  }
}
