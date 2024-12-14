/*
** DROP THIS IN HTML **
<app-recipe-history-modal [Params]="recipeHistoryModalParams"></app-recipe-history-modal>

** DROP THIS IN TYPESCRIPT **
recipeHistoryModalParams;

this.recipeHistoryModalParams = {
  function: this.updateRecipeHistoryEvent,
  recipeId: recipe.id,
  uid: this.user.uid,
  householdId: this.householdId
  timesCooked: this.timesCooked,
  text: 'Edit times cooked for ' + recipe.name
};
*/

import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent, ModalComponentParams } from '@modalComponent';
import { ErrorMatcher } from '../../util/error-matcher';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';

export interface RecipeHistoryModalParams extends ModalComponentParams {
  function: RecipeDetailComponent['updateRecipeHistoryEvent'];
  recipeId: string;
  uid: string;
  householdId: string;
  timesCooked: number;
  text: string;
}

@Component({
  selector: 'app-recipe-history-modal',
  templateUrl: './recipe-history-modal.component.html',
  styleUrls: ['./recipe-history-modal.component.scss'],
})
export class RecipeHistoryModalComponent implements OnInit {
  form: FormGroup;
  timesCooked: number;

  matcher = new ErrorMatcher();

  params?: RecipeHistoryModalParams;

  @Input()
  set Params(params: RecipeHistoryModalParams | undefined) {
    this.params = params;
    if (this.params) {
      this.form.patchValue({
        timesCooked: this.params.timesCooked,
      });
    }
  }

  @ViewChild(ModalComponent)
  modal: ModalComponent<RecipeHistoryModalParams>;

  constructor() {}

  ngOnInit() {
    this.form = new FormBuilder().group({
      timesCooked: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+/)]],
    });
  }

  cancel(): void {
    this.modal.close();
  }

  onSubmit(updateDate = false): void {
    if (this.form.invalid) {
      return;
    }

    this.params?.function(
      this.params.recipeId,
      this.params.uid,
      this.params.householdId,
      this.form.get('timesCooked')?.value,
      updateDate
    );
    this.modal.close();
  }
}
