import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IngredientsService } from '../ingredients.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
  FormArray} from '@angular/forms';

@Component({
  selector: 'app-ingredients-create',
  templateUrl: './ingredients-create.component.html',
  styleUrls: ['./ingredients-create.component.css']
})
export class IngredientsCreateComponent implements OnInit {

  ingredientsForm: FormGroup;
  name: string;
  category: string;
  calories: number;
  // quantity: number;

  constructor(private router: Router, private ingredientsService: IngredientsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.ingredientsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'category' : [null],
      'calories': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      // 'quantity': ['', [Validators.min(1), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
  }

  onFormSubmit(form: NgForm) {
    this.ingredientsService.postIndegredients(form)
      .subscribe(res => {
        const id = res['key'];
        this.router.navigate(['/ingredients-detail/', id]);
      }, (err) => {
        console.error(err);
      });
  }
}
