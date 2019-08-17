import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatExpansionModule,
} from '@angular/material';

import { ItemRoutingModule } from './item-routing.module';
import { ItemListComponent } from './item-list/item-list.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ItemListComponent
  ],
  imports: [
    CommonModule,
    ItemRoutingModule,
    MatExpansionModule,
    SharedModule
  ]
})
export class ItemModule { }
