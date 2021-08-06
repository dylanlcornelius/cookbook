/*
** DROP THIS IN HTML **
<app-ingredient-modal [Params]="ingredientModalParams"></app-ingredient-modal>

** DROP THIS IN TYPESCRIPT **
ingredientModalParams;

this.ingredientModalParams = {
  function: this.editIngredientEvent,
  data,
  userIngredients,
  dataSource,
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
import { NumberService } from 'src/app/util/number.service';
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
        pantryQuantity: this.numberService.toFormattedFraction(this.params.data.pantryQuantity)
      });
    }
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(
    private formBuilder: FormBuilder,
    private numberService: NumberService,
  ) {}

  ngOnInit() {
    this.ingredientModalForm = this.formBuilder.group({
      'pantryQuantity': [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,4})?$|\d+\/\d+/)]]
    });
  }

  cancel() {
    this.modal.close();
  }

  confirm() {
    this.params.userIngredients.find(x => x.id === this.params.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.params.dataSource.data.find(x => x.id === this.params.data.id)
      .pantryQuantity = this.ingredientModalForm.get('pantryQuantity').value;
    this.params.function();
    this.modal.close();
  }
}
