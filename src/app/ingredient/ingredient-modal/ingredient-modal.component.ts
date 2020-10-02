/*
** DROP THIS IN HTML **
<app-ingredient-modal [Params]="ingredientModalParams"></app-ingredient-modal>

** DROP THIS IN TYPESCRIPT **
ingredientModalParams;

this.ingredientModalParams = {
  function: this.editIngredientEvent,
  data: data,
  self: this,
  text: 'Edit pantry quantity for ' + ingredient.name
};
*/

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ErrorMatcher } from '../../util/error-matcher';

@Component({
  selector: 'app-ingredient-modal',
  templateUrl: './ingredient-modal.component.html',
  styleUrls: ['./ingredient-modal.component.scss']
})
export class IngredientModalComponent implements OnInit {
  ingredientModalForm: FormGroup;
  pantryQuantity: number;

  matcher = new ErrorMatcher();

  params;

  @Input()
  set Params(params) {
    this.params = params;
    if (this.params) {
      this.ingredientModalForm.patchValue({
        pantryQuantity: this.params.data.pantryQuantity
      });
    }
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ingredientModalForm = this.formBuilder.group({
      'pantryQuantity': [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,16})?$/)]]
    });
  }

  cancel() {
    this.modal.close();
  }

  confirm() {
    this.params.self.userIngredients.find(x => x.id === this.params.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.params.self.dataSource.data.find(x => x.id === this.params.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.params.function(this.params.self);
    this.modal.close();
  }
}
