import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShoppingRoutingModule } from './shopping-routing.module';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

import { SharedModule } from '@sharedModule';

@NgModule({
  declarations: [
    ShoppingListComponent,
  ],
  imports: [
    CommonModule,
    ShoppingRoutingModule,
    SharedModule,
  ]
})
export class ShoppingModule { }
