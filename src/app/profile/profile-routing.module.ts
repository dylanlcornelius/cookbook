import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from 'src/app/profile/profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

const routes: Routes = [
  {
    path: 'settings',
    title: 'Profile Settings',
    component: ProfileComponent,
    data: { selectedTabIndex: 0 },
  },
  {
    path: 'settings/:id',
    title: 'Profile Settings for Admins',
    component: ProfileComponent,
    data: { selectedTabIndex: 0 },
  },
  {
    path: 'analytics',
    title: 'Profile Analytics',
    component: ProfileComponent,
    data: { selectedTabIndex: 1 },
  },
  {
    path: 'recipe-history',
    title: 'Profile Recipe History',
    component: ProfileComponent,
    data: { selectedTabIndex: 2 },
  },
  { path: 'list', title: 'Profile List', component: ProfileListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
