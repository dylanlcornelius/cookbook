import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@notification';
import { Validation } from '@validation';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { TutorialModal } from '@tutorial';

@Injectable({ providedIn: 'root' })
export abstract class ModalService<T> {
  modal = new BehaviorSubject<T>(undefined);

  getModal(): BehaviorSubject<T> {
    return this.modal;
  }
  setModal(options: T): void {
    this.modal.next(options);
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService extends ModalService<Notification> {}

@Injectable({ providedIn: 'root' })
export class ValidationService extends ModalService<Validation> {}

@Injectable({ providedIn: 'root' })
export class RecipeIngredientModalService extends ModalService<RecipeIngredientModal> {}

@Injectable({ providedIn: 'root' })
export class TutorialModalService extends ModalService<TutorialModal> {}
