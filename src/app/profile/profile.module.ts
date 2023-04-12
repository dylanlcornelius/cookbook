import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

import { SharedModule } from '@sharedModule';
import { HouseholdComponent } from './household/household.component';
import { HouseholdInviteModalComponent } from './household-invite-modal/household-invite-modal.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

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
