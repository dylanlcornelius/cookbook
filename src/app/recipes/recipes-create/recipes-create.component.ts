import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from '../recipe.service';
import { IngredientService} from '../../ingredients/ingredient.service';
import { ErrorStateMatcher } from '@angular/material';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-recipes-create',
  templateUrl: './recipes-create.component.html',
  styleUrls: ['./recipes-create.component.css']
})
export class RecipesCreateComponent implements OnInit {

  loading: Boolean = true;
  recipesForm: FormGroup;
  stepsForm: FormGroup;
  name: string;
  description: string;
  time: number;
  servings: number;
  calories: number;
  // quantity: number;
  steps: Array<{step: string}>;

  addedIngredients = [];
  availableIngredients = [];

  matcher = new ErrorMatcher();

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.initIngredients();

    this.recipesForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'description' : [null],
      'time': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'servings': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      // 'quantity': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
      'steps': this.formBuilder.array([
        this.initStep()
      ]),
    });
  }

  initStep() {
    return this.formBuilder.group({
      step: [null]
    });
  }

  addStep() {
    const control = <FormArray>this.recipesForm.controls['steps'];
    control.push(this.initStep());
  }

  removeStep(i: number) {
    const control = <FormArray>this.recipesForm.controls['steps'];
    control.removeAt(i);
  }

  initIngredients() {
    this.ingredientService.getIngredients()
      .subscribe(data => {
        this.availableIngredients = data;
        this.loading = false;
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  submitForm() {
    this.recipesForm.addControl('ingredients', new FormArray(this.addedIngredients.map(c => new FormControl({id: c.id}))));
    this.recipesForm.addControl('user', new FormControl(this.cookieService.get('LoggedIn')));
    this.onFormSubmit(this.recipesForm.value);
  }

  onFormSubmit(form: NgForm) {
    this.recipeService.postRecipe(form)
      .subscribe(res => {
        const id = res['id'];
        this.router.navigate(['/recipes-detail/', id]);
      }, (err) => {
        console.error(err);
      });
  }
}
