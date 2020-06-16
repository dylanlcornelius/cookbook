import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IngredientService } from '@ingredientService';
import {
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators
} from '@angular/forms';
import { UOM } from '../shared/uom.emun';
import { ErrorMatcher } from '../../util/error-matcher';

@Component({
  selector: 'app-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: ['./ingredient-edit.component.scss']
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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private ingredientService: IngredientService,
  ) {
    this.uoms = Object.values(UOM);
  }

  ngOnInit() {
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'amount': [null, [Validators.required, Validators.min(0), Validators.pattern('(^[0-9]*)+(\\.[0-9]{0,2})?$')]],
      'uom': [null, Validators.required],
      'category': [null],
      'calories': [null, [Validators.min(0), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });

    if (this.route.snapshot.params['id']) {
      this.ingredientService.getIngredient(this.route.snapshot.params['id']).then(data => {
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
      this.ingredientService.putIngredient(this.id, form);
      this.router.navigate(['/ingredient/detail/', this.id]);
    } else {  
      const id = this.ingredientService.postIngredient(form)
      this.router.navigate(['/ingredient/detail/', id]);
    }
  }
}
