import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { Ingredient } from '@ingredient';
import { IngredientService } from '@ingredientService';
import { LoadingService } from '@loadingService';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { NumberService } from '@numberService';
import { TitleService } from '@TitleService';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ingredient-detail',
  templateUrl: './ingredient-detail.component.html',
  styleUrls: ['./ingredient-detail.component.scss'],
})
export class IngredientDetailComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;
  ingredient: Ingredient;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: TitleService,
    private loadingService: LoadingService,
    private ingredientService: IngredientService,
    private notificationService: NotificationService,
    private numberService: NumberService,
    private validationService: ValidationService,
    private configService: ConfigService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.route.params.subscribe((params) => {
      this.loading = this.loadingService.set(true);
      const ingredient$ = this.ingredientService.getById(params['id']);
      const configs$ = this.configService.getByName(ConfigType.INGREDIENT_CATEGORY);

      combineLatest([ingredient$, configs$])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([ingredient, configs]) => {
          this.titleService.set(ingredient.name);
          this.ingredient = ingredient;
          this.ingredient.displayCategory =
            configs.find(({ value }) => value === this.ingredient.category)?.displayValue ||
            'Other';
          if (this.ingredient.amount) {
            this.ingredient.amount = this.numberService.toFormattedFraction(this.ingredient.amount);
          }
          if (this.ingredient.altAmount) {
            this.ingredient.altAmount = this.numberService.toFormattedFraction(
              this.ingredient.altAmount
            );
          }
          this.loading = this.loadingService.set(false);
        });
    });
  }

  deleteIngredient(id: string): void {
    this.validationService.setModal({
      text: `Are you sure you want to delete ingredient ${this.ingredient.name}?`,
      function: this.deleteIngredientEvent,
      args: [id],
    });
  }

  deleteIngredientEvent = (id?: string): void => {
    if (id) {
      this.ingredientService.delete(id);
      this.notificationService.setModal(new SuccessNotification('Ingredient deleted!'));
      this.router.navigate(['/ingredient/list'], { replaceUrl: true });
    }
  };
}
