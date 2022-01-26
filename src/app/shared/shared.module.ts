import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { RecipeIngredientModalComponent } from './recipe-ingredient-modal/recipe-ingredient-modal.component';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';
import { ModalComponent } from './modal/modal.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { TutorialModalComponent } from './tutorial-modal/tutorial-modal.component';
import { TutorialComponent } from './tutorial-modal/tutorial/tutorial.component';

@NgModule({
  declarations: [
    LoadingModalComponent,
    NotificationModalComponent,
    RecipeIngredientModalComponent,
    ValidationModalComponent,
    ModalComponent,
    ImageUploadComponent,
    TutorialModalComponent,
    TutorialComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatPaginatorModule,
    MatCheckboxModule,
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
    RecipeIngredientModalComponent,
    ValidationModalComponent,
    ModalComponent,
    ImageUploadComponent,
    TutorialModalComponent,
  ]
})
export class SharedModule { }
