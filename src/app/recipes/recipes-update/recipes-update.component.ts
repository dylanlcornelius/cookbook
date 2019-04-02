import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService} from '../../ingredients/ingredient.service';
import { CookieService } from 'ngx-cookie-service';
import { ErrorStateMatcher } from '@angular/material';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-recipes-update',
  templateUrl: './recipes-update.component.html',
  styleUrls: ['./recipes-update.component.css']
})
export class RecipesUpdateComponent implements OnInit {

  loading: Boolean = true;
  recipesForm: FormGroup;
  id: string;
  name: string;
  description: string;
  time: number;
  servings: number;
  calories: number;
  steps: Array<{step: string}>;

  addedIngredients = [];
  availableIngredients = [];

  matcher = new ErrorMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.recipeService.getRecipe(this.route.snapshot.params['id'])
      .subscribe(data => {
        this.id = data.id;
        if (data.steps !== undefined) {
          for (let i = 1; i < data.steps.length; i++) {
            this.addStep();
          }
        }
        this.addedIngredients = data.ingredients;
        this.recipesForm.setValue({
          name: data.name,
          description: data.description,
          time: data.time,
          servings: data.servings,
          calories: data.calories,
          steps: data.steps
        });

        this.ingredientService.getIngredients()
          .subscribe(ingredients => {
            const added = [];
            ingredients.forEach(ingredient => {
              let found = false;
              this.addedIngredients.forEach(addedIngredient => {
                if (ingredient.id === addedIngredient.id) {
                  found = true;
                  added.push({
                    id: ingredient.id,
                    name: ingredient.name,
                    amount: ingredient.amount,
                    uom: ingredient.uom,
                    quantity: addedIngredient.quantity
                  });
                }
              });
              if (!found) {
                this.availableIngredients.push({
                  id: ingredient.id,
                  name: ingredient.name,
                  amount: ingredient.amount,
                  uom: ingredient.uom,
                  quantity: 0
                });
              }
            });
            this.addedIngredients = added;
            this.loading = false;
          });
      });


    this.recipesForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'description' : [null],
      'time' : ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'servings': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'steps': this.formBuilder.array([
        this.initStep()
      ])
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
    this.recipeService.putRecipes(this.id, form)
      .subscribe(res => {
        this.router.navigate(['/recipes-detail/', this.id]);
      }, (err) => {
        console.error(err);
      });
  }

  recipesDetail() {
    this.router.navigate(['/recipes-detail/', this.id]);
  }
}
