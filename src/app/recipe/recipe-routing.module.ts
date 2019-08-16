import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

const routes: Routes = [
  {path: 'list', redirectTo: 'list/', pathMatch: 'full'},
  {path: 'list/:id', component: RecipeListComponent},
  {path: 'detail/:id', component: RecipeDetailComponent},
  {path: 'edit', redirectTo: 'edit/', pathMatch: 'full'},
  {path: 'edit/:id', component: RecipeEditComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipeRoutingModule { }
