import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import { FormGroupDirective, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UOM, UOMs } from '@uoms';
import { ErrorMatcher } from '../../util/error-matcher';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '@loadingService';
import { Ingredient } from '@ingredient';
import { Configs } from '@config';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { TitleService } from '@TitleService';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.scss'],
})
export class IngredientEditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  loading = true;
  title: string;

  ingredientsForm: FormGroup;
  ingredient: Ingredient;
  id: string;
  uoms: UOMs;
  categories: Configs;
  hasAlternative = false;

  matcher = new ErrorMatcher();

  @Input()
  isQuickView = false;

  @Output()
  handleIngredientCreate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private titleService: TitleService,
    private loadingService: LoadingService,
    private ingredientService: IngredientService,
    private configService: ConfigService
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public load(): void {
    const configs$ = this.configService.get(ConfigType.INGREDIENT_CATEGORY);

    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      this.id = params['ingredient-id'];
      this.ingredientsForm = new FormBuilder().group({
        name: [null, Validators.required],
        amount: [
          null,
          [
            Validators.required,
            Validators.min(0),
            Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$'),
          ],
        ],
        uom: [null, Validators.required],
        altAmount: [null, [Validators.min(0), Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$')]],
        altUOM: [null],
        category: [null, Validators.required],
        calories: [null, [Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      });

      const observables$: [Observable<Configs>, Observable<Ingredient>?] = [configs$];
      if (this.id) {
        observables$.push(this.ingredientService.get(this.id));
        this.title = 'Edit an Ingredient';
      } else {
        if (!this.isQuickView) {
          this.titleService.set('Create a New Ingredient');
        }
        this.title = 'Create a New Ingredient';
      }

      combineLatest(observables$)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(([configs, ingredient]) => {
          this.categories = configs;
          this.ingredient = ingredient;

          if (ingredient) {
            this.titleService.set(`Edit ${ingredient.name}`);

            this.hasAlternative = !!this.ingredient.altAmount;
            this.setAltValidators();

            this.ingredientsForm.patchValue({
              name: this.ingredient.name,
              category: this.ingredient.category,
              amount: this.ingredient.amount || '',
              uom: this.ingredient.uom || '',
              altAmount: this.ingredient.altAmount || '',
              altUOM: this.ingredient.altUOM || '',
              calories: this.ingredient.calories,
            });
          }
          this.loading = this.loadingService.set(false);
        });
    });
  }

  setAltValidators(): void {
    if (this.hasAlternative) {
      this.ingredientsForm.controls['altAmount'].addValidators([Validators.required]);
      this.ingredientsForm.controls['altUOM'].addValidators([Validators.required]);
    } else {
      this.ingredientsForm.controls['altAmount'].removeValidators([Validators.required]);
      this.ingredientsForm.controls['altUOM'].removeValidators([Validators.required]);
    }
    this.ingredientsForm.controls['altAmount'].updateValueAndValidity();
    this.ingredientsForm.controls['altUOM'].updateValueAndValidity();
  }

  select(): void {
    this.hasAlternative = !this.hasAlternative;
    this.setAltValidators();

    if (!this.hasAlternative) {
      this.ingredientsForm.patchValue({
        altAmount: '',
        altUOM: '',
      });
    }
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.ingredientsForm.invalid) {
      return;
    }

    const form = this.ingredientsForm.value;

    if (this.id) {
      form.creationDate = this.ingredient.creationDate;

      this.ingredientService.update(new Ingredient(form).getObject(), this.id);
      this.router.navigate(['/ingredient/detail/', this.id]);
    } else {
      const id = this.ingredientService.create(new Ingredient(form).getObject());

      if (this.isQuickView) {
        this.handleIngredientCreate.emit(true);
      } else {
        this.router.navigate(['/ingredient/detail/', id]);
      }
    }
    formDirective.resetForm();
    this.ingredientsForm.reset();
  }
}
