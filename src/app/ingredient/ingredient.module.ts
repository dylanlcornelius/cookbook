import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IngredientRoutingModule } from './ingredient-routing.module';
import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { IngredientQuickCreateComponent } from './ingredient-quick-create/ingredient-quick-create.component';
import { UomTableComponent } from './uom-table/uom-table.component';

import { SharedModule } from '@sharedModule';

@NgModule({
  declarations: [
    IngredientListComponent,
    IngredientDetailComponent,
    IngredientEditComponent,
    IngredientQuickCreateComponent,
    UomTableComponent,
  ],
  imports: [CommonModule, IngredientRoutingModule, SharedModule],
  exports: [IngredientQuickCreateComponent, UomTableComponent],
})
export class IngredientModule {}
