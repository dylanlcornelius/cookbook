import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FsService } from '../fs.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators } from '@angular/forms';

@Component({
  selector: 'app-recipes-update',
  templateUrl: './recipes-update.component.html',
  styleUrls: ['./recipes-update.component.css']
})
export class RecipesUpdateComponent implements OnInit {

  recipesForm: FormGroup;
  id: string;
  name: string;
  description: string;

  constructor(private router: Router, private route: ActivatedRoute, private fs: FsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getRecipe(this.route.snapshot.params['id']);
    this.recipesForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'description' : [null, Validators.required]
    });
  }

  getRecipe(id) {
    this.fs.getRecipe(id)
      .subscribe(data => {
        this.id = data.key;
        this.recipesForm.setValue({
          name: data.name,
          description: data.description
        });
      });
  }

  onFormSubmit(form: NgForm) {
    this.fs.putRecipes(this.id, form)
      .subscribe(res => {
        this.router.navigate(['/recipes']);
      }, (err) => {
        console.error(err);
      });
  }

  recipesDetail() {
    this.router.navigate(['/recipes-detail/', this.id]);
  }
}
