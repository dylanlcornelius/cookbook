import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  recipes = [
    { name: 'Chili' },
    { name: 'Spaghetti' },
    { name: 'Hamburgers'}
  ];

  constructor() {
  }

  ngOnInit() {
  }
}
