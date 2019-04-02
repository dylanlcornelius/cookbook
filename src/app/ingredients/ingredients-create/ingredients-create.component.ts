import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  selector: 'app-ingredients-create',
  templateUrl: './ingredients-create.component.html',
  styleUrls: ['./ingredients-create.component.css']
})
export class IngredientsCreateComponent implements OnInit {

  ingredientsForm: FormGroup;
  name: string;
  category: string;
  amount: string;
  uom: Array<UOM>;
  calories: number;

  matcher = new ErrorMatcher();

  constructor(
    private router: Router,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder
  ) {
    this.uom = Object.values(UOM);
  }

  ngOnInit() {
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category' : [null],
      'amount': [null, [Validators.required, Validators.min(0), Validators.pattern('(^[0-9]{1})+(.[0-9]{0,2})?$')]],
      'uom': [null, Validators.required],
      'calories': [null, [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }

  onFormSubmit(form: NgForm) {
    this.ingredientService.postIngredient(form)
      .subscribe(res => {
        const id = res['id'];
        this.router.navigate(['/ingredients-detail/', id]);
      }, (err) => {
        console.error(err);
      });
  }
}
