import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { UOM } from '@UOMConverson';
import { ErrorMatcher } from '../../util/error-matcher';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  id: string;
  name: string;
  category: string;
  amount: string;
  uoms: Array<UOM>;
  calories: number;

  matcher = new ErrorMatcher();

  @Input()
  isQuickView: boolean = false;

  @Output()
  handleIngredientCreate: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
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

  public load() {
    if (this.route.snapshot.params['ingredient-id']) {
      this.ingredientService.get(this.route.snapshot.params['ingredient-id']).pipe(takeUntil(this.unsubscribe$)).subscribe(data => {
        this.id = data.id;
        this.ingredientsForm.patchValue({
          name: data.name,
          category: data.category,
          amount: data.amount || '',
          uom: data.uom || '',
          calories: data.calories
        });
        this.title = 'Edit an Ingredient';
        this.loading = false;
      });
    } else {
      this.title = 'Add a new Ingredient';
      this.loading = false;
    }
  }

  onFormSubmit(form: NgForm, formDirective: FormGroupDirective) {
    if (this.route.snapshot.params['ingredient-id']) {
      this.ingredientService.update(form.value, this.id);
      this.router.navigate(['/ingredient/detail/', this.id]);
    } else {
      const id = this.ingredientService.create(form.value);
      
      if (this.isQuickView) {
        this.handleIngredientCreate.emit(true);
      } else {
        this.router.navigate(['/ingredient/detail/', id]);
      }
    }
    formDirective.resetForm();
    form.reset();
  }
}
