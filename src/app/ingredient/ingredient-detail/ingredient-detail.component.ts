import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { NotificationType } from '@notifications';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NotificationService } from 'src/app/shared/notification-modal/notification.service';
import { Notification } from 'src/app/shared/notification-modal/notification.model';

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ingredientService: IngredientService,
    private notificationService: NotificationService,
  ) { }

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
      self.notificationService.setNotification(new Notification(NotificationType.SUCCESS, 'Ingredient deleted!'));
      self.router.navigate(['/ingredient/list']);
    }
  }
}
