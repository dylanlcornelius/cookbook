import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from 'src/app/profile/profile/profile.component';

const routes: Routes = [
  {path: 'settings', component: ProfileComponent, data: {selectedTabIndex: 0}},
  {path: 'analytics', component: ProfileComponent, data: {selectedTabIndex: 1}},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
