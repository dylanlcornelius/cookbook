import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { UOM } from '../uom.emun';
import { ErrorStateMatcher } from '@angular/material';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-ingredients-update',
  templateUrl: './ingredients-update.component.html',
  styleUrls: ['./ingredients-update.component.css']
})
export class IngredientsUpdateComponent implements OnInit {

  loading = true;
  ingredientsForm: FormGroup;
  id: string;
  name: string;
  category: string;
  amount: string;
  uoms: Array<UOM>;
  calories: number;

  matcher = new ErrorMatcher();

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.getIngredient(this.route.snapshot.params['id']);
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category': [null],
      'amount': [null, [Validators.required, Validators.min(0), Validators.pattern('(^[0-9]{1})+(.[0-9]{0,2})?$')]],
      'uom': [null, Validators.required],
      'calories': [null, [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }

  getIngredient(id) {
    this.ingredientService.getIngredient(id)
      .subscribe(data => {
        this.id = data.id;
        this.ingredientsForm.setValue({
          name: data.name,
          category: data.category,
          amount: data.amount || '',
          uom: data.uom || '',
          calories: data.calories
        });
        this.loading = false;
      });
  }

  onFormSubmit(form: NgForm) {
    this.ingredientService.putIngredient(this.id, form)
      .subscribe(res => {
        this.router.navigate(['/ingredients-detail/', this.id]);
      }, (err) => {
        console.error(err);
      });
  }

  ingredientsDetail() {
    this.router.navigate(['/ingredients-detail/', this.id]);
  }
}
