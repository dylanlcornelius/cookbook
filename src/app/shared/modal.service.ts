import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '@notification';
import { Validation } from '@validation';
import { RecipeIngredientModal } from '@recipeIngredientModal';

export abstract class Modal {}

@Injectable({
  providedIn: 'root'
})
export abstract class ModalService {
  modal: BehaviorSubject<Modal>;

  getModal() {
    return this.modal;
  };
  setModal(options: Modal) {
    this.modal.next(options);
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends ModalService {
  modal = new BehaviorSubject<Notification>(undefined);
}

@Injectable({
  providedIn: 'root'
})
export class ValidationService extends ModalService {
  modal = new BehaviorSubject<Validation>(undefined);
}

@Injectable({
  providedIn: 'root'
})
export class RecipeIngredientModalService extends ModalService {
  modal = new BehaviorSubject<RecipeIngredientModal>(undefined);
}
