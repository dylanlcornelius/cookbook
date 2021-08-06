/*
** DROP THIS IN HTML **
<app-recipe-history-modal [Params]="recipeHistoryModalParams"></app-recipe-history-modal>

** DROP THIS IN TYPESCRIPT **
recipeHistoryModalParams;

this.recipeHistoryModalParams = {
  function: this.updateRecipeHistoryEvent,
  recipeId: recipe.id,
  uid: this.user.defaultShoppingList,
  timesCooked: this.timesCooked,
  text: 'Edit times cooked for ' + recipe.name
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
  selector: 'app-recipe-history-modal',
  templateUrl: './recipe-history-modal.component.html',
  styleUrls: ['./recipe-history-modal.component.scss']
})
export class RecipeHistoryModalComponent implements OnInit {
  form: FormGroup;
  timesCooked: number;

  matcher = new ErrorMatcher();

  params;

  @Input()
  set Params(params) {
    this.params = params;
    if (this.params) {
      this.form.patchValue({
        timesCooked: this.params.timesCooked
      });
    }
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  constructor(
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      'timesCooked': [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+/)]]
    });
  }

  cancel() {
    this.modal.close();
  }

  confirm() {
    this.params.function(
      this.params.recipeId,
      this.params.uid,
      this.form.get('timesCooked').value,
    );
    this.modal.close();
  }
}
