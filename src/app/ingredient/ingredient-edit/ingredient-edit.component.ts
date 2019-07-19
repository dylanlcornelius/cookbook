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
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.css']
})
export class IngredientEditComponent implements OnInit {

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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category': [null],
      'amount': [null, [Validators.required, Validators.min(0), Validators.pattern('(^[0-9]{1})+(.[0-9]{0,2})?$')]],
      'uom': [null, Validators.required],
      'calories': [null, [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

    if (this.route.snapshot.params['id']) {
      this.ingredientService.getIngredient(this.route.snapshot.params['id'])
        .subscribe(data => {
          this.id = data.id;
          this.ingredientsForm.setValue({
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

  onFormSubmit(form: NgForm) {
    if (this.route.snapshot.params['id']) {
      this.ingredientService.putIngredient(this.id, form)
        .subscribe(() => {
          this.router.navigate(['/ingredient-detail/', this.id]);
        }, (err) => {
          console.error(err);
        });
    } else {
      this.ingredientService.postIngredient(form)
        .subscribe(res => {
          const id = res['id'];
          this.router.navigate(['/ingredient-detail/', id]);
        }, (err) => {
          console.error(err);
        });
    }
  }

  ingredientsDetail() {
    this.router.navigate(['/ingredient-detail/', this.id]);
  }
}
