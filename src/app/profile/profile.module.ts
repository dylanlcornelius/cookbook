import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

import { SharedModule } from '@sharedModule';
import { HouseholdComponent } from './household/household.component';
import { HouseholdInviteModalComponent } from './household-invite-modal/household-invite-modal.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileListComponent,
    HouseholdComponent,
    HouseholdInviteModalComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatTableModule,
    NgxChartsModule,
    SharedModule,
  ]
})
export class ProfileModule { }
