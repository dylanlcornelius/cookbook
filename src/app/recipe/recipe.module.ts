import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from '@sharedModule';
import { IngredientModule } from '../ingredient/ingredient.module';
import { CategoryChipsComponent } from './category-chips/category-chips.component';
import { CommentListComponent } from './comment-list/comment-list.component';
import { RatingComponent } from './rating/rating.component';
import { RecipeBookComponent } from './recipe-book/recipe-book.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';
import { RecipeHistoryModalComponent } from './recipe-history-modal/recipe-history-modal.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeRatingModalComponent } from './recipe-rating-modal/recipe-rating-modal.component';
import { RecipeRoutingModule } from './recipe-routing.module';
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
    RecipeBookComponent,
  ],
  imports: [
    CommonModule,
    RecipeRoutingModule,
    MatAutocompleteModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatStepperModule,
    MatRadioModule,
    DragDropModule,
    SharedModule,
    IngredientModule,
  ],
})
export class RecipeModule {}
