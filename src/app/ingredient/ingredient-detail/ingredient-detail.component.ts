import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { Notification } from '@notifications';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss']
})
export class IngredientDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading: Boolean = true;
  validationModalParams;
  notificationModalParams;
  ingredient;

  constructor(private route: ActivatedRoute, private ingredientService: IngredientService) { }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load() {
    this.ingredientService.getIngredient(this.route.snapshot.params['id']).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
      this.ingredient = data;
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
      self.ingredientService.deleteIngredient(id);
      self.notificationModalParams = {
        self: self,
        type: Notification.SUCCESS,
        path: '/ingredient/list',
        text: 'Ingredient deleted!'
      };
    }
  }
}
