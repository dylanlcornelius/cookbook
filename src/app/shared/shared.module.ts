import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatIconModule,
  MatInputModule,
  MatCardModule,
  MatPaginatorModule,
  MatChipsModule,
  MatFormFieldModule,
  MatSelectModule,
  MatButtonModule,
  MatTableModule,
  MatSortModule,
  MatTooltipModule,
  MatMenuModule,
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';

@NgModule({
  declarations: [
    LoadingModalComponent,
    NotificationModalComponent,
    ValidationModalComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    LoadingModalComponent,
    NotificationModalComponent,
    ValidationModalComponent,
  ]
})
export class SharedModule { }
