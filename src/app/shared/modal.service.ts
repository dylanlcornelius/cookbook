import { Injectable } from '@angular/core';
import { Notification } from '@notification';
import { TutorialModal } from '@tutorial';
import { BehaviorSubject } from 'rxjs';
import { RecipeIngredientModalParams } from 'src/app/shared/recipe-ingredient-modal/recipe-ingredient-modal.component';
import { ValidationModalParams } from 'src/app/shared/validation-modal/validation-modal.component';

@Injectable({ providedIn: 'root' })
export abstract class ModalService<T> {
  modal = new BehaviorSubject<T | undefined>(undefined);

  getModal(): BehaviorSubject<T | undefined> {
    return this.modal;
  }
  setModal(options: T | undefined): void {
    this.modal.next(options);
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService extends ModalService<Notification> {}

@Injectable({ providedIn: 'root' })
export class ValidationService extends ModalService<ValidationModalParams> {}

@Injectable({ providedIn: 'root' })
export class RecipeIngredientModalService extends ModalService<RecipeIngredientModalParams> {}

@Injectable({ providedIn: 'root' })
export class TutorialModalService extends ModalService<TutorialModal> {}
