import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { takeUntil } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { NotificationService, ValidationService } from '@modalService';
import { SuccessNotification } from '@notification';
import { Ingredient } from '@ingredient';
import { Validation } from '@validation';
import { LoadingService } from '@loadingService';
import { NumberService } from '@numberService';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { TitleService } from '@TitleService';

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
    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      const ingredient$ = this.ingredientService.get(params['id']);
      const configs$ = this.configService.get(ConfigType.INGREDIENT_CATEGORY);

      combineLatest([ingredient$, configs$])
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([ingredient, configs]) => {
          this.titleService.set(ingredient.name);
          this.ingredient = ingredient;
          this.ingredient.displayCategory =
            configs.find(({ value }) => value === this.ingredient.category)?.displayValue ||
            'Other';
          this.ingredient.amount = this.numberService.toFormattedFraction(this.ingredient.amount);
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
    this.validationService.setModal(
      new Validation(
        `Are you sure you want to delete ingredient ${this.ingredient.name}?`,
        this.deleteIngredientEvent,
        [id]
      )
    );
  }

  deleteIngredientEvent = (id: string): void => {
    if (id) {
      this.ingredientService.delete(id);
      this.notificationService.setModal(new SuccessNotification('Ingredient deleted!'));
      this.router.navigate(['/ingredient/list']);
    }
  };
}
