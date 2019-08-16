import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatTabsModule,
  MatSlideToggleModule,
} from '@angular/material';
import { ChartsModule } from 'ng2-charts';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';

import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule,
    MatSlideToggleModule,
    ChartsModule,
    SharedModule,
  ]
})
export class ProfileModule { }
