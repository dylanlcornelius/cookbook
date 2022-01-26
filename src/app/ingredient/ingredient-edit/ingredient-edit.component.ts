import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { UOM } from '@uoms';
import { ErrorMatcher } from '../../util/error-matcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoadingService } from '@loadingService';
import { TutorialService } from '@tutorialService';
import { Ingredient } from '@ingredient';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.scss']
})
export class IngredientEditComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject();
  loading = true;
  title: string;

  ingredientsForm: FormGroup;
  ingredient: Ingredient;
  id: string;
  name: string;
  category: string;
  amount: string;
  uoms: Array<UOM>;
  calories: number;

  matcher = new ErrorMatcher();

  @Input()
  isQuickView = false;

  @Output()
  handleIngredientCreate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    public route: ActivatedRoute,
    private loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
    private tutorialService: TutorialService,
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'amount': [null, [Validators.required, Validators.min(0), Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$')]],
      'uom': [null, Validators.required],
      'category': [null],
      'calories': [null, [Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public load(): void {
    this.route.params.subscribe(params => {
      this.loading = this.loadingService.set(true);
      this.id = params['ingredient-id'];

      if (this.id) {
        this.ingredientService.get(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe(ingredient => {
          this.ingredient = ingredient;

          this.ingredientsForm.patchValue({
            name: ingredient.name,
            category: ingredient.category,
            amount: ingredient.amount || '',
            uom: ingredient.uom || '',
            calories: ingredient.calories
          });
          this.title = 'Edit an Ingredient';
          this.loading = this.loadingService.set(false);
        });
      } else {
        this.id = undefined;
        this.title = 'Add a new Ingredient';
        this.loading = this.loadingService.set(false);
      }
    });
  }

  onFormSubmit(formDirective: FormGroupDirective): void {
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

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
