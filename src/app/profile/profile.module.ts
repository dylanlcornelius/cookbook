import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

import { SharedModule } from '@sharedModule';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileListComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    MatProgressBarModule,
    NgxChartsModule,
    SharedModule,
  ]
})
export class ProfileModule { }
