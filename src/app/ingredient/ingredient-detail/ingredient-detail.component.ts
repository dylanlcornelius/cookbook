import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from '@notificationService';
import { SuccessNotification } from '@notification';
import { NumberService } from 'src/app/util/number.service';
import { Ingredient } from '@ingredient';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading: Boolean = true;
  validationModalParams;
  ingredient: Ingredient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    private notificationService: NotificationService,
    private numberService: NumberService,
  ) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.ingredientService.get(this.route.snapshot.params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.ingredient = data;
      this.ingredient.amount = this.numberService.toFormattedFraction(this.ingredient.amount);
      this.loading = false;
    });
  }

  deleteIngredient(id) {
    this.validationModalParams = {
      id: id,
      self: this,
      text: 'Are you sure you want to delete ingredient ' + this.ingredient.name + '?',
      function: this.deleteIngredientEvent
    };
  }

  deleteIngredientEvent(self, id) {
    if (id) {
      self.ingredientService.delete(id);
      self.notificationService.setNotification(new SuccessNotification('Ingredient deleted!'));
      self.router.navigate(['/ingredient/list']);
    }
  }
}
