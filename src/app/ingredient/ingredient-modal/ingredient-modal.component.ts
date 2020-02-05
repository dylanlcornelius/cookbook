/*
** DROP THIS IN HTML **
<app-ingredient-modal [IngredientModalParams]="ingredientModalParams"></app-ingredient-modal>

** DROP THIS IN TYPESCRIPT **
ingredientModalParams;

this.ingredientModalParams = {
  function: this.editIngredientEvent,
  data: data,
  self: this,
  text: 'Edit pantry quantity for ' + ingredient.name
};
*/

import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
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

  ingredientModalParams;

  @Input()
  set IngredientModalParams(params) {
    this.ingredientModalParams = params;
    if (this.ingredientModalParams) {
      this.ingredientModalForm.setValue({
        pantryQuantity: this.ingredientModalParams.data.pantryQuantity
      });
    }
  }

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.ingredientModalForm = this.formBuilder.group({
      'pantryQuantity': [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,16})?$/)]]
    });
  }

  cancel() {
    this.ingredientModalParams = undefined;
  }

  confirm() {
    this.ingredientModalParams.self.userIngredients.find(x => x.id === this.ingredientModalParams.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.ingredientModalParams.self.dataSource.data.find(x => x.id === this.ingredientModalParams.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.ingredientModalParams.function(this.ingredientModalParams.self);
    this.ingredientModalParams = undefined;
  }
}
