import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { RecipeRatingModalComponent } from './recipe-rating-modal/recipe-rating-modal.component';
import { CategoryChipsComponent } from './category-chips/category-chips.component';
import { RecipeStepsComponent } from './recipe-steps/recipe-steps.component';
import { RecipeBookComponent } from './recipe-book/recipe-book.component';

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
    RecipeBookComponent,
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
