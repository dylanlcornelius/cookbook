import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { IngredientsService } from '../ingredients.service';

@Component({
  selector: 'app-ingredients-list',
  templateUrl: './ingredients-list.component.html',
  styleUrls: ['./ingredients-list.component.css']
})
export class IngredientsListComponent implements OnInit {

  loading: Boolean = true;
  displayedColumns = ['name', 'category', 'calories', 'quantity'];
  dataSource = [];

  constructor(private ingredientsService: IngredientsService) {
  }

  ngOnInit() {
    this.ingredientsService.getIngredients().subscribe((result) => {
      this.dataSource = result;
      this.loading = false;
    });
  }
}
