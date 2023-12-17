import { TestBed } from '@angular/core/testing';
import { Notification, SuccessNotification } from '@notification';
import { take } from 'rxjs/operators';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service: ModalService<Notification>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getModal', () => {
    it('should return a subject of Modal', () => {
      service.modal.next(new SuccessNotification('text'));

      service
        .getModal()
        .pipe(take(1))
        .subscribe(notification => {
          expect(notification).toBeDefined();
        });
    });
  });

  describe('setModal', () => {
    it('should set a subject with a Modal', () => {
      service.setModal(new SuccessNotification('text'));

      service.modal.pipe(take(1)).subscribe(modal => {
        expect(modal).toBeDefined();
      });
    });
  });
});
