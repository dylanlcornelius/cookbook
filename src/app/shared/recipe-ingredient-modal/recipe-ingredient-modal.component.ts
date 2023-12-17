import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ModalComponent } from '@modalComponent';
import { RecipeIngredientModal } from '@recipeIngredientModal';
import { RecipeIngredientModalService } from '@modalService';
import { RecipeIngredients } from '@recipeIngredient';

@Component({
  selector: 'app-recipe-ingredient-modal',
  templateUrl: './recipe-ingredient-modal.component.html',
  styleUrls: ['./recipe-ingredient-modal.component.scss'],
})
export class RecipeIngredientModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  params: RecipeIngredientModal;

  @ViewChild(ModalComponent)
  modal: ModalComponent;

  selectionCount = 0;

  constructor(private recipeIngredientModalService: RecipeIngredientModalService) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.recipeIngredientModalService
      .getModal()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((modal: RecipeIngredientModal) => {
        this.params = modal;
      });
  }

  select(isSelected: boolean): void {
    this.selectionCount += isSelected ? 1 : -1;
  }

  add(): void {
    let selectedIngredients: RecipeIngredients = [];
    this.params.recipeIngredients.forEach(ingredient => {
      if (ingredient.selected) {
        selectedIngredients.push(ingredient);
      }
    });

    if (selectedIngredients.length === 0) {
      selectedIngredients = this.params.recipeIngredients;
    }

    this.params.function(
      selectedIngredients,
      this.params.userIngredients,
      this.params.ingredients,
      this.params.uid,
      this.params.householdId,
      this.params.recipe,
      this.params.recipes
    );

    this.selectionCount = 0;
    this.modal.close(true);
  }

  cancel(): void {
    this.modal.close();
  }
}
