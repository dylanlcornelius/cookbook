import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatBadgeModule } from '@angular/material/badge';
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
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { RecipeRatingModalComponent } from './recipe-rating-modal/recipe-rating-modal.component';
import { CategoryChipsComponent } from './category-chips/category-chips.component';
import { RecipeStepsComponent } from './recipe-steps/recipe-steps.component';

@NgModule({
  declarations: [
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    RatingComponent,
    RecipeHistoryModalComponent,
    CommentListComponent,
    RecipeRatingModalComponent,
    CategoryChipsComponent,
    RecipeStepsComponent,
  ],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatStepperModule,
    DragDropModule,
    SharedModule,
    IngredientModule,
  ],
})
export class RecipeModule {}
