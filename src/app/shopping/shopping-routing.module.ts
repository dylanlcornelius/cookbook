import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { MealPlannerComponent } from './meal-planner/meal-planner.component';

const routes: Routes = [
  { path: 'list', component: ShoppingListComponent },
  { path: 'plan', component: MealPlannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShoppingRoutingModule { }
