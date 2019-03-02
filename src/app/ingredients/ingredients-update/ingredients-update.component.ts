import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '../ingredient.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray } from '@angular/forms';

@Component({
  selector: 'app-ingredients-update',
  templateUrl: './ingredients-update.component.html',
  styleUrls: ['./ingredients-update.component.css']
})
export class IngredientsUpdateComponent implements OnInit {

  // TODO: create validation for missing columns

  loading: Boolean = true;
  ingredientsForm: FormGroup;
  id: string;
  name: string;
  category: string;
  amount: string;
  calories: number;
  // quantity: number;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private ingredientService: IngredientService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getIngredient(this.route.snapshot.params['id']);
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category': [null],
      'amount': [null],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      // 'quantity': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
  }

  getIngredient(id) {
    this.ingredientService.getIngredient(id)
      .subscribe(data => {
        this.id = data.key;
        this.ingredientsForm.setValue({
          name: data.name,
          category: data.category,
          amount: data.amount,
          calories: data.calories
        });
        this.loading = false;
      });
  }

  onFormSubmit(form: NgForm) {
    this.ingredientService.putIngredients(this.id, form)
      .subscribe(res => {
        // this.router.navigate(['/recipes']);
        this.router.navigate(['/ingredients-detail/', this.id]);
      }, (err) => {
        console.error(err);
      });
  }

  ingredientsDetail() {
    this.router.navigate(['/ingredients-detail/', this.id]);
  }
}
