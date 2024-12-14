import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Configs } from '@config';
import { ConfigService } from '@configService';
import { ConfigType } from '@configType';
import { Ingredient } from '@ingredient';
import { IngredientService } from '@ingredientService';
import { LoadingService } from '@loadingService';
import { TitleService } from '@TitleService';
import { VOLUME_UOM, VOLUME_UOMs, WEIGHT_UOM, WEIGHT_UOMs } from '@uoms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ErrorMatcher } from '../../util/error-matcher';

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
  ingredient?: Ingredient;
  id: string;
  volumeUnits: VOLUME_UOMs;
  weightUnits: WEIGHT_UOMs;
  categories: Configs;
  buyableOptions = [
    { value: 'volume', label: 'Volume' },
    { value: 'weight', label: 'Weight' },
  ];

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
    this.volumeUnits = Object.values(VOLUME_UOM);
    this.weightUnits = Object.values(WEIGHT_UOM);
  }

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public load(): void {
    const configs$ = this.configService.getByName(ConfigType.INGREDIENT_CATEGORY);

    this.route.params.subscribe((params) => {
      this.loading = this.loadingService.set(true);
      this.id = params['ingredient-id'];
      this.ingredientsForm = new FormBuilder().group({
        name: [null, Validators.required],
        amount: [null, [Validators.min(0), Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$')]],
        uom: [null],
        altAmount: [null, [Validators.min(0), Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$')]],
        altUOM: [null],
        buyableUOM: [null],
        category: [null, Validators.required],
        calories: [null, [Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      });

      const observables$: [Observable<Configs>, Observable<Ingredient>?] = [configs$];
      if (this.id) {
        observables$.push(this.ingredientService.getById(this.id));
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

          if (this.ingredient) {
            this.titleService.set(`Edit ${this.ingredient.name}`);

            this.ingredientsForm.patchValue({
              name: this.ingredient.name,
              category: this.ingredient.category,
              amount: this.ingredient.amount || '',
              uom: this.ingredient.uom || '',
              altAmount: this.ingredient.altAmount || '',
              altUOM: this.ingredient.altUOM || '',
              buyableUOM: this.ingredient.buyableUOM,
              calories: this.ingredient.calories,
            });

            this.onBuyableSelect();
          }
          this.loading = this.loadingService.set(false);
        });
    });
  }

  onBuyableSelect(): void {
    const isVolume = this.ingredientsForm.controls['buyableUOM'].value === 'volume';
    if (isVolume) {
      this.ingredientsForm.controls['amount'].addValidators([Validators.required]);
      this.ingredientsForm.controls['uom'].addValidators([Validators.required]);
      this.ingredientsForm.controls['altAmount'].removeValidators([Validators.required]);
      this.ingredientsForm.controls['altUOM'].removeValidators([Validators.required]);
    } else {
      this.ingredientsForm.controls['amount'].removeValidators([Validators.required]);
      this.ingredientsForm.controls['uom'].removeValidators([Validators.required]);
      this.ingredientsForm.controls['altAmount'].addValidators([Validators.required]);
      this.ingredientsForm.controls['altUOM'].addValidators([Validators.required]);
    }
    this.ingredientsForm.controls['amount'].updateValueAndValidity();
    this.ingredientsForm.controls['uom'].updateValueAndValidity();
    this.ingredientsForm.controls['altAmount'].updateValueAndValidity();
    this.ingredientsForm.controls['altUOM'].updateValueAndValidity();
  }

  onSubmit(formDirective: FormGroupDirective): void {
    if (this.ingredientsForm.invalid) {
      return;
    }

    const form = this.ingredientsForm.value;

    if (this.id && this.ingredient) {
      form.creationDate = this.ingredient.creationDate;

      this.ingredientService.update(new Ingredient(form).getObject(), this.id);
      this.router.navigate(['/ingredient/detail/', this.id]);
    } else {
      const id = this.ingredientService.create(new Ingredient(form).getObject());

      if (this.isQuickView) {
        this.handleIngredientCreate.emit(true);
      } else {
        this.router.navigate(['/ingredient/detail/', id], { replaceUrl: true });
      }
    }
    formDirective.resetForm();
    this.ingredientsForm.reset();
  }
}
