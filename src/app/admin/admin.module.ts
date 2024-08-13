import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

import { SharedModule } from '@sharedModule';
import { TableViewComponent } from './table-view/table-view.component';

@NgModule({
  declarations: [AdminDashboardComponent, TableViewComponent],
  imports: [CommonModule, AdminRoutingModule, SharedModule, MatTabsModule],
})
export class AdminModule {}
