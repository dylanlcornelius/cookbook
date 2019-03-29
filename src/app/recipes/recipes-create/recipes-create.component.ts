import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray} from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CookieService } from 'ngx-cookie-service';
import { RecipeService } from '../recipe.service';
import { IngredientService} from '../../ingredients/ingredient.service';

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
  steps: Array<{step: string}>;

  addedIngredients = [];
  availableIngredients = [];

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.ingredientService.getIngredients()
      .subscribe(ingredients => {
        ingredients.forEach(ingredient => {
          this.availableIngredients.push({
            id: ingredient.id,
            name: ingredient.name,
            amount: ingredient.amount,
            uom: ingredient.uom,
            quantity: 0
          });
        });
        this.loading = false;
      });

    this.recipesForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'description' : [null],
      'time': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'servings': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
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

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  removeIngredient(id) {
    const data = this.addedIngredients.find(x => x.id === id);
    if (data.quantity > 0) {
      data.quantity = Number(data.quantity) - Number(data.amount);
    }
  }

  addIngredient(id) {
    const data = this.addedIngredients.find(x => x.id === id);
    data.quantity = Number(data.quantity) + Number(data.amount);
  }

  submitForm() {
    this.recipesForm.addControl(
      'ingredients', new FormArray(this.addedIngredients.map(c => new FormControl({id: c.id, quantity: c.quantity})))
      );
    this.recipesForm.addControl('user', new FormControl(this.cookieService.get('LoggedIn')));
    this.onFormSubmit(this.recipesForm.value);
  }

  onFormSubmit(form: NgForm) {
    this.recipeService.postRecipe(form)
      .subscribe(res => {
        this.router.navigate(['/recipes-detail/', res.id]);
      }, (err) => {
        console.error(err);
      });
  }
}
