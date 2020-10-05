import { Component, Input, ViewChild } from '@angular/core';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { IngredientEditComponent } from '../ingredient-edit/ingredient-edit.component';

@Component({
  selector: 'app-ingredient-quick-create',
  templateUrl: './ingredient-quick-create.component.html',
  styleUrls: ['./ingredient-quick-create.component.scss']
})
export class IngredientQuickCreateComponent {
  @Input()
  params;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  @ViewChild(IngredientEditComponent)
  edit: IngredientEditComponent;

  constructor() { }

  open() {
    this.edit.load();
    this.modal.open();
  }

  close() {
    this.modal.close();
  }
}
