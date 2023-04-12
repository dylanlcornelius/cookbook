import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { MealPlannerComponent } from './meal-planner/meal-planner.component';

import { SharedModule } from '@sharedModule';

@NgModule({
  declarations: [
    ShoppingListComponent,
    MealPlannerComponent,
  ],
  imports: [
    CommonModule,
    MatAutocompleteModule,
    ShoppingRoutingModule,
    SharedModule,
  ]
})
export class ShoppingModule { }
