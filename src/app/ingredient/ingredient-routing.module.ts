import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { UomTableComponent } from './uom-table/uom-table.component';

const routes: Routes = [
  { path: 'list', component: IngredientListComponent },
  { path: 'detail/:id', component: IngredientDetailComponent },
  { path: 'edit', redirectTo: 'edit/', pathMatch: 'full' },
  { path: 'edit/:ingredient-id', component: IngredientEditComponent },
  { path: 'uom', component: UomTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientRoutingModule { }
