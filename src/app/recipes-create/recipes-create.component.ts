import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FsService } from '../fs.service';
import {
  FormControl,
  FormGroupDirective,
  FormBuilder,
  FormGroup, NgForm,
  Validators } from '@angular/forms';

@Component({
  selector: 'app-recipes-create',
  templateUrl: './recipes-create.component.html',
  styleUrls: ['./recipes-create.component.css']
})
export class RecipesCreateComponent implements OnInit {

  recipesForm: FormGroup;
  name: string;
  description: string;

  constructor(private router: Router, private fs: FsService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.recipesForm = this.formBuilder.group({
      'name' : [null, Validators.required],
      'description' : [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.fs.postRecipes(form)
      .subscribe(res => {
        let id = res['key'];
        this.router.navigate(['/recipes-detail/', id]);
      }, (err) => {
        console.error(err);
      });
  }
}
