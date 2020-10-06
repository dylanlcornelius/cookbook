import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientRoutingModule } from './ingredient-routing.module';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { IngredientModalComponent } from './ingredient-modal/ingredient-modal.component';
import { IngredientQuickCreateComponent } from './ingredient-quick-create/ingredient-quick-create.component';

import { SharedModule } from '@sharedModule';

@NgModule({
  declarations: [
    IngredientListComponent,
    IngredientDetailComponent,
    IngredientEditComponent,
    IngredientModalComponent,
    IngredientQuickCreateComponent,
  ],
  imports: [
    CommonModule,
    IngredientRoutingModule,
    SharedModule,
  ],
  exports: [
    IngredientQuickCreateComponent,
  ]
})
export class IngredientModule { }
