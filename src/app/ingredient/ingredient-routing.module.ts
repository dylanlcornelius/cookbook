import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IngredientListComponent } from './ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient-edit/ingredient-edit.component';
import { UomTableComponent } from './uom-table/uom-table.component';

const routes: Routes = [
  { path: 'list', title: 'Ingredients List', component: IngredientListComponent },
  { path: 'detail/:id', title: 'Ingredient', component: IngredientDetailComponent },
  { path: 'edit', title: 'Edit Ingredient', redirectTo: 'edit/', pathMatch: 'full' },
  { path: 'edit/:ingredient-id', title: 'Edit Ingredient', component: IngredientEditComponent }, // must use ingredient-id, as the recipe-edit page uses id
  { path: 'uom', title: 'Unit of Measurements Table', component: UomTableComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngredientRoutingModule {}
