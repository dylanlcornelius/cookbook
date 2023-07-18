import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

const routes: Routes = [
  { path: 'list', title: 'Recipe List', redirectTo: 'list/', pathMatch: 'full' },
  { path: 'list/:id', title: 'Recipe List', component: RecipeListComponent },
  { path: 'detail/:id', title: 'Recipe', component: RecipeDetailComponent },
  { path: 'edit', title: 'Edit Recipe', redirectTo: 'edit/', pathMatch: 'full' },
  { path: 'edit/:id', title: 'Edit Recipe', component: RecipeEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipeRoutingModule {}
