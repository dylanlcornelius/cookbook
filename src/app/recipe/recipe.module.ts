import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule } from '@angular/material/stepper';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { RecipeRoutingModule } from './recipe-routing.module';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RatingComponent } from './rating/rating.component';

import { SharedModule } from '@sharedModule';
import { IngredientModule } from '../ingredient/ingredient.module';
import { RecipeHistoryModalComponent } from './recipe-history-modal/recipe-history-modal.component';
import { CommentListComponent } from './comment-list/comment-list.component';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RatingComponent,
    RecipeHistoryModalComponent,
    CommentListComponent,
  ],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatCheckboxModule,
    MatStepperModule,
    DragDropModule,
    SharedModule,
    IngredientModule,
  ]
})
export class RecipeModule { }
