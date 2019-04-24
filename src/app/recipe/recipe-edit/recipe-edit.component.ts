import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray
} from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService} from '../../ingredient/ingredient.service';
import { CookieService } from 'ngx-cookie-service';
import { ErrorStateMatcher } from '@angular/material';
import { UOM } from 'src/app/ingredients/uom.emun';

class ErrorMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return (control && control.invalid && (control.dirty || control.touched));
  }
}

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {

  loading: Boolean = true;
  title: string;

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

  uoms: Array<UOM>;

  matcher = new ErrorMatcher();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.recipesForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'description' : [null],
      'time' : ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'servings': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'steps': this.formBuilder.array([
        this.initStep()
      ]),
      'ingredients': this.formBuilder.array([])
    });

    if (this.route.snapshot.params['id']) {
      this.recipeService.getRecipe(this.route.snapshot.params['id'])
        .subscribe(data => {
          this.id = data.id;
          if (data.steps !== undefined) {
            for (let i = 1; i < data.steps.length; i++) {
              this.addStep();
            }
          }
          this.addedIngredients = data.ingredients;
          this.ingredientService.getIngredients()
            .subscribe(ingredients => {
              const added = [];
              this.addedIngredients.forEach(addedIngredient => {
                ingredients.forEach(ingredient => {
                  if (ingredient.id === addedIngredient.id) {
                    added.push({
                      id: ingredient.id,
                      name: ingredient.name,
                      quantity: addedIngredient.quantity || '',
                      uom: addedIngredient.uom || '',
                    });
                    ingredients = ingredients.filter(i => i.id !== addedIngredient.id);
                  }
                });
              });

              if (added !== undefined) {
                for (let i = 0; i < added.length; i++) {
                  this.addIngredient(i);
                }
              }
              this.addedIngredients = added;
              this.recipesForm.setValue({
                name: data.name,
                description: data.description,
                time: data.time,
                servings: data.servings,
                calories: data.calories,
                steps: data.steps,
                ingredients: added,
              });

              ingredients.forEach(ingredient => {
                ingredient.quantity = '';
                ingredient.uom = '';
              });
              this.availableIngredients = ingredients;

              this.title = 'Edit a Recipe';
              this.loading = false;
            });
        });
    } else {
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

          this.title = 'Add a new Recipe';
          this.loading = false;
        });
    }
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

  dropAdded(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      this.removeIngredient(event.previousIndex);
      this.addIngredient(event.currentIndex, event.item.data);
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      this.addIngredient(event.currentIndex, event.item.data);
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  dropAvailable(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.removeIngredient(event.previousIndex);
    }
  }

  initIngredient() {
    return this.formBuilder.group({
      id: [null],
      quantity: [null, [Validators.required, Validators.min(0), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      uom: [null, [Validators.required]],
      name: [null],
    });
  }

  addIngredient(index, data?) {
    const control = <FormArray>this.recipesForm.controls['ingredients'];
    const ingredientControl = this.initIngredient();
    if (data) {
      ingredientControl.setValue({
        id: data.id,
        name: data.name,
        quantity: data.quantity,
        uom: data.uom,
      });
    }
    control.insert(index, ingredientControl);
  }

  removeIngredient(i: number) {
    const control = <FormArray>this.recipesForm.controls['ingredients'];
    control.removeAt(i);
  }

  submitForm() {
    Object.values((<FormGroup> this.recipesForm.get('ingredients')).controls).forEach((ingredient: FormGroup) => {
      ingredient.removeControl('name');
    });
    this.recipesForm.addControl('user', new FormControl(this.cookieService.get('LoggedIn')));
    this.onFormSubmit(this.recipesForm.value);
  }

  onFormSubmit(form: NgForm) {
    if (this.route.snapshot.params['id']) {
      this.recipeService.putRecipes(this.id, form)
        .subscribe(() => {
          this.router.navigate(['/recipe-detail/', this.id]);
        }, (err) => {
          console.error(err);
        });
    } else {
      this.recipeService.postRecipe(form)
        .subscribe(res => {
          this.router.navigate(['/recipe-detail/', res.id]);
        }, (err) => {
          console.error(err);
        });
    }
  }

  recipesDetail() {
    this.router.navigate(['/recipe-detail/', this.id]);
  }
}
