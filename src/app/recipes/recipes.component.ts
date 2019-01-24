import { Component, OnInit } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { FsService } from '../fs.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css']
})
export class RecipesComponent implements OnInit {

  // recipes = [
  //   { name: 'Chili' },
  //   { name: 'Spaghetti' },
  //   { name: 'Hamburgers'}
  // ];

  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity'];
  dataSource = new RecipeDataSource(this.fs);

  constructor(private fs: FsService) {
  }

  ngOnInit() {
  }
}

export class RecipeDataSource extends DataSource<any> {

  constructor(private fs: FsService) {
    super();
  }

  connect() {
    return this.fs.getRecipes();
  }

  disconnect() {}
}
