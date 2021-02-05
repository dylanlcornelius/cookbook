import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from 'src/app/profile/profile/profile.component';
import { ProfileListComponent } from './profile-list/profile-list.component';

const routes: Routes = [
  {path: 'settings', component: ProfileComponent, data: {selectedTabIndex: 0}},
  {path: 'analytics', component: ProfileComponent, data: {selectedTabIndex: 1}},
  {path: 'recipe-history', component: ProfileComponent, data: {selectedTabIndex: 2}},
  {path: 'list', component: ProfileListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
