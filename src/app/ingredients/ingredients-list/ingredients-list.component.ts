import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { IngredientService } from '../ingredient.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit {

  loading: Boolean = true;
  displayedColumns = ['name', 'category', 'amount', 'calories', 'quantity'];
  dataSource = [];

  constructor(private ingredientService: IngredientService) { }

  ngOnInit() {
    this.ingredientService.getIngredients().subscribe((result) => {
      this.dataSource = result;
      this.loading = false;
    });
  }
}
