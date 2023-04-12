import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoadingModalComponent } from './loading-modal/loading-modal.component';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';
import { RecipeIngredientModalComponent } from './recipe-ingredient-modal/recipe-ingredient-modal.component';
import { ValidationModalComponent } from './validation-modal/validation-modal.component';
import { ModalComponent } from '@modalComponent';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { TutorialModalComponent } from './tutorial-modal/tutorial-modal.component';
import { TutorialComponent } from './tutorial-modal/tutorial/tutorial.component';
import { OptionalIngredientsPipe } from './optional-ingredients.pipe';
import { FormValidationDirective } from './form-validation.directive';

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
    OptionalIngredientsPipe,
    FormValidationDirective,
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
    LoadingModalComponent,
    NotificationModalComponent,
    RecipeIngredientModalComponent,
    ValidationModalComponent,
    ModalComponent,
    ImageUploadComponent,
    TutorialModalComponent,
    OptionalIngredientsPipe,
    FormValidationDirective,
  ]
})
export class SharedModule { }
