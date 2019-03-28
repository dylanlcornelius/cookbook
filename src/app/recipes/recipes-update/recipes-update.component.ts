import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientService} from '../../ingredients/ingredient.service';
import { CookieService } from 'ngx-cookie-service';

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
  // quantity: number;
  steps: Array<{step: string}>;

  addedIngredients = [];
  availableIngredients = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private cookieService: CookieService,
    private recipeService: RecipeService,
    private ingredientService: IngredientService,
  ) { }

  ngOnInit() {
    this.getRecipe(this.route.snapshot.params['id']);
    this.recipesForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'description' : [null],
      'time' : ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'servings': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      // 'quantity': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
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

  getRecipe(id) {
    this.recipeService.getRecipe(id)
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
        this.initIngredients();
        this.loading = false;
      });
  }

  initIngredients() {
    this.ingredientService.getIngredients()
      .subscribe(data => {
        const added = [];
        data.forEach(d => {
          let found = false;
          this.addedIngredients.forEach(addedIngredient => {
            if (d.id === addedIngredient.id) {
              found = true;
              added.push({name: d.name, id: d.id});
            }
          });
          if (!found) {
            this.availableIngredients.push({name: d.name, id: d.id});
          }
        });
        this.addedIngredients = added;
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
    this.recipeService.putRecipes(this.id, form)
      .subscribe(res => {
        // this.router.navigate(['/recipes']);
        this.router.navigate(['/recipes-detail/', this.id]);
      }, (err) => {
        console.error(err);
      });
  }

  recipesDetail() {
    this.router.navigate(['/recipes-detail/', this.id]);
  }
}
