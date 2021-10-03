import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { NumberService } from 'src/app/util/number.service';
import { Ingredient } from '@ingredient';
import { Validation } from '@validation';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  ingredient: Ingredient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    private notificationService: NotificationService,
    private numberService: NumberService,
    private validationService: ValidationService,
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.route.params.subscribe(params => {
      this.ingredientService.get(params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.ingredient = data;
        this.ingredient.amount = this.numberService.toFormattedFraction(this.ingredient.amount);
        this.loading = false;
      });
    });
  }

  deleteIngredient(id: string): void {
    this.validationService.setModal(new Validation(
      `Are you sure you want to delete ingredient ${this.ingredient.name}?`,
      this.deleteIngredientEvent,
      [id]
    ));
  }

  deleteIngredientEvent = (id: string): void => {
    if (id) {
      this.ingredientService.delete(id);
      this.notificationService.setModal(new SuccessNotification('Ingredient deleted!'));
      this.router.navigate(['/ingredient/list']);
    }
  };
}
