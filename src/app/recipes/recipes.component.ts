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

  loading: Boolean = true;
  displayedColumns = ['name', 'time', 'calories', 'servings', 'quantity'];
  // dataSource = new RecipeDataSource(this.fs);
  dataSource = [];

  constructor(private fs: FsService) {
  }

  ngOnInit() {
    this.fs.getRecipes().subscribe((result) => {
      this.dataSource = result;
      this.loading = false;
    });
  }
}

// export class RecipeDataSource extends DataSource<any> {

//   constructor(private fs: FsService) {
//     super();
//   }

//   connect() {
//     // return this.fs.getRecipes();
//   }

//   disconnect() {}
// }
