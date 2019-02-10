import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RecipesService } from '../recipes.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { IngredientsService} from '../../ingredients/ingredients.service';

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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private ingredientsService: IngredientsService) { }

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
    this.recipesService.getRecipe(id)
      .subscribe(data => {
        this.id = data.key;
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
    this.ingredientsService.getIngredients()
      .subscribe(data => {
        data.forEach(d => {
          let found = false;
          this.addedIngredients.forEach(added => {
            // console.log(d.key + ':' + added.key);
            if (d.key === added.key) {
              found = true;
            }
          });
          if (!found) {
            this.availableIngredients.push({name: d.name, key: d.key});
          }
          // TODO: Look into using indexOf instead of above loop
          // if (this.addedIngredients.indexOf(d.key) == null) {
          //   this.availableIngredients.push({name: d.name, key: d.key});
          // }
        });
        // TODO: Splice instead of above methods
        // this.availableIngredients = data;
        // this.availableIngredients.forEach(available => {
        //   this.addedIngredients.forEach(added => {
        //     if (added.key === available.key) {
        //       this.availableIngredients.splice(this.availableIngredients.indexOf(available.key), 1);
        //     }
        //   });
        // });

        // console.log(this.addedIngredients);
        // console.log(this.availableIngredients);
      });
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  // TODO: combine submitForm and onFormSubmit into one?
  submitForm() {
    this.recipesForm.addControl('ingredients', new FormArray(this.addedIngredients.map(c => new FormControl({name: c.name, key: c.key}))));
    this.onFormSubmit(this.recipesForm.value);
  }

  onFormSubmit(form: NgForm) {
    this.recipesService.putRecipes(this.id, form)
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
